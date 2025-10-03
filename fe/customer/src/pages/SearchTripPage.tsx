import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import IconDeparture from "../components/IconDeparture";
import Loading from "../components/Loading";
import SearchTrip from "../components/SearchTrip";
import SortTrip from "../components/SortTrip";
import { getLocations, searchTrips } from "../services/trip.service";
import styles from "../styles/searchTripPage.module.scss";
import { ParamsSearchTrips, SearchTripResponse, TripInfoBase } from "../types/trip";
import { formatCurrency } from "../utils/formatCurrency";
import { formatDate } from "../utils/formatDate";

const ITEMS_PER_PAGE = 1;

const SearchTripPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchTrip, setIsSearchTrip] = useState<boolean>(false);
  const [tripDataSeeMore, setTripDataSeeMore] = useState<SearchTripResponse | null>(null);
  const [searchParamsValue, setSearchParamsValue] = useState<ParamsSearchTrips>({
    from: { id: 0, name: "" },
    to: { id: 0, name: "" },
    start_time: "",
    sort: "",
  });

  const { data: locationData } = useQuery({
    queryKey: ["locations"],
    queryFn: () => getLocations(),
    staleTime: 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // const {
  //   data: tripsData,
  //   isLoading: isTripLoading,
  //   isError: isTripError,
  // } = useQuery({
  //   queryKey: ["search-trips", searchParamsValue],
  //   queryFn: () =>
  //     searchTrips({
  //       from: searchParamsValue.from.id,
  //       to: searchParamsValue.to.id,
  //       start_time: searchParamsValue.start_time,
  //       sort: searchParamsValue.sort || "",
  //       limit: ITEMS_PER_PAGE,
  //       offset: 0,
  //     }),
  //   staleTime: 60 * 60 * 1000,
  //   enabled: isSearchTrip,
  //   refetchOnWindowFocus: false,
  // });

  const {
    data: searchTripsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isErrSearchTrip,
    error: errSearchTrip,
    isLoading: isSearchTripsLoading,
  } = useInfiniteQuery({
    queryKey: ["search-trip-infinite", searchParamsValue],
    queryFn: ({ pageParam = 0 }) =>
      searchTrips({
        from: searchParamsValue.from.id,
        to: searchParamsValue.to.id,
        start_time: searchParamsValue.start_time,
        sort: searchParamsValue.sort || "",
        limit: ITEMS_PER_PAGE,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.data.length < ITEMS_PER_PAGE) return undefined;
      return allPages.length * ITEMS_PER_PAGE;
    },
    initialPageParam: 0,
    enabled: isSearchTrip,
  });

  useEffect(() => {
    if (!locationData) {
      return;
    } else {
      const today = new Date();
      const defaultDate = today.toISOString().split("T")[0];

      setSearchParamsValue((prev) => {
        const fromName = searchParams.get("from") || "Đà Nẵng";
        const fromLocation = locationData?.find((l) => l.name === fromName);
        const toName = searchParams.get("to") || "Hồ Chí Minh";
        const toLocation = locationData?.find((l) => l.name === toName);

        return {
          ...prev,
          from: { id: fromLocation?.id || 0, name: fromName },
          to: { id: toLocation?.id || 0, name: toName },
          start_time: searchParams.get("start_time") || defaultDate,
          sort: searchParams.get("sort") || "default",
        };
      });
      setIsSearchTrip(true);
    }
  }, [locationData, searchParams]);

  useEffect(() => {
    if (searchTripsData?.pages) {
      const mergedData = searchTripsData.pages.flatMap((page) => page?.data || []);
      const lastPage = searchTripsData.pages[searchTripsData.pages.length - 1];

      setTripDataSeeMore({
        status: lastPage?.status ?? "success",
        total: mergedData.length,
        totalPage: Math.ceil(mergedData.length / ITEMS_PER_PAGE),
        data: mergedData,
      });
    }
  }, [searchTripsData]);

  const handleChangeSortValue = (sortValue: string) => {
    setSearchParamsValue((prev) => ({ ...prev, sort: sortValue }));

    const newParams = new URLSearchParams(searchParams);
    if (sortValue === "default") {
      newParams.delete("sort");
      setSearchParams(newParams);
    } else {
      newParams.set("sort", sortValue);
      setSearchParams(newParams);
    }
  };

  const hanleDetailTrip = (trip: TripInfoBase) => {
    const { licensePlate, departure, arrival, startTime, endTime } = trip;
    const startDate = formatDate(startTime, "YYYY-MM-DD-HH:mm", false);
    const endDate = formatDate(endTime, "YYYY-MM-DD-HH:mm", false);
    const getStartDay = startDate.split(" ")[0];
    const getStartHour = startDate.split(" ")[1];
    const getEndDay = endDate.split(" ")[0];
    const getEndHour = endDate.split(" ")[1];
    console.log("time", getStartHour);
    navigate(
      `/dat-ve?license_plate=${licensePlate}&from=${departure}&to=${arrival}&start_day=${getStartDay}&start_hours=${getStartHour}&end_day=${getEndDay}&end_hours=${getEndHour}`
    );
  };

  const handleSeeMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className={styles["search-trip-page-wrapper"]}>
      <div className={styles["search-trip-cpn-wrapper"]}>
        <SearchTrip valueSearchIn={searchParamsValue} />
      </div>
      <div className={styles["search-trip"]}>
        <div className={styles["sort-filtered-container"]}>
          <div className={styles["sort-wrapper"]}>
            <SortTrip
              onchange={handleChangeSortValue}
              valueIn={searchParamsValue.sort ?? "default"}
            />
          </div>
          <div className={styles["sort-filtered-container"]} hidden>
            <div className={styles["filtered-wrapper"]}>filter</div>
          </div>
        </div>

        {isErrSearchTrip && (
          <p>{errSearchTrip ? errSearchTrip.message : `Lỗi tìm kiếm chuyến đi`}</p>
        )}
        {tripDataSeeMore && !isSearchTripsLoading ? (
          <div className={styles["result-search-trip-info"]}>
            <div className={styles["result-total-trips"]}>
              <p className={styles["label"]}>Kết quả:</p>
              <p className={styles["result"]}>{tripDataSeeMore?.total}</p>
            </div>
            <div className={styles["result-search-trips"]}>
              {tripDataSeeMore.data &&
                tripDataSeeMore.data.map((t, index) => (
                  <div key={`${t.id}-${index}`} className={styles["result-search-trip__item"]}>
                    <div className={styles["result-search-container"]}>
                      <div className={styles["img-trip"]}>
                        <img
                          src={t.image}
                          alt={`img-${t.id}`}
                          loading="lazy"
                          className={styles.image}
                        />
                      </div>
                      <div className={styles["info-trip"]}>
                        <div className={styles["info-trip__title"]}>
                          <p className={styles["info-trip__title-name"]}>{t.tripName}</p>
                          <p className={styles["info-trip__title-price"]}>
                            {formatCurrency(Number(t.price))}
                          </p>
                        </div>
                        <div className={styles["info-trip__detail"]}>
                          <div className={styles["info-trip__detail-ic-from-to"]}>
                            <IconDeparture />
                            <div className={styles.dash}>
                              <span className={styles["no-select"]}>.........</span>
                            </div>
                            <FontAwesomeIcon
                              className={`${styles.ic} ${styles["ic-departure"]}`}
                              icon={faLocationDot}
                            />
                          </div>
                          <div className={styles["info-trip__detail-hour-location"]}>
                            <div className={styles["info-trip__detail-hour"]}>
                              <p>
                                {formatDate(t.startTime, "DD-MM-YYYY-HH:mm", false).split(" ")[0]}
                              </p>
                              <p>
                                {formatDate(t.endTime, "DD-MM-YYYY-HH:mm", false).split(" ")[0]}
                              </p>
                            </div>
                            <div className={styles["info-trip__detail-location"]}>
                              <p>{t.departure}</p>
                              <p>{t.arrival}</p>
                            </div>
                          </div>
                          <div className={styles["info-trip__detail-and-actions"]}>
                            <p
                              className={styles.strong}
                            >{`Còn ${t.totalSeatAvailable} chỗ trống`}</p>
                            <button
                              type="button"
                              className={styles["btn-detail-trip"]}
                              onClick={() => hanleDetailTrip(t)}
                            >
                              Xem chuyến
                            </button>
                          </div>
                        </div>
                        <div className={styles["notify-trip"]}>
                          <p>Vé chặng thuộc chuyến</p>
                          <p>{`${formatDate(t.startTime, "DD-MM-YYYY-HH:mm")}`}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {tripDataSeeMore.total >= tripDataSeeMore.data.length && (
                <button onClick={handleSeeMore} disabled={!hasNextPage || isFetchingNextPage}>
                  Xem thêm
                </button>
              )}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default SearchTripPage;

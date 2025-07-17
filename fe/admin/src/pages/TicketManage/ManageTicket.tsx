import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { GoTriangleDown } from "react-icons/go";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import SearchInput from "../../components/SearchInput";
import styles from "../../styles/ticketManage.module.scss";
import { ArrangeType } from "../../types/type";
import { debounce } from "../../utils/debounce";
import formatCurrency from "../../utils/formatCurrency";
import { PaymentType } from "../../types/ticket";
import SelectTypeTicket from "../../components/SelectedTypeTicket";
import { getTickets } from "../../services/ticket.service";
import { faEye, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ITEMS_PER_PAGE = 2;

const TicketManage: React.FC = () => {
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>();
  const location = useLocation();
  const [arrangeType, setArrangeType] = useState<ArrangeType>("desc");
  const [currentPage, setCurrentPage] = useState<number>(
    page ? Math.max(1, parseInt(page, 10)) - 1 : 0
  );
  const [searchTransactionValue, setSearchTransactionValue] = useState<string>("");
  const [selectedType, setSelectedType] = useState<PaymentType>("all");

  const urlMain = "/ticket-manage";

  const { data, isLoading, error } = useQuery({
    queryKey: ["tickets", currentPage, arrangeType, searchTransactionValue, selectedType],
    queryFn: () =>
      getTickets({
        offset: currentPage * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        arrangeType,
        transaction: searchTransactionValue,
        paymentType: selectedType.trim() as PaymentType,
        paymentStatus: "paid",
        phone: "",
      }),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `Quản lý vé xe`;
  }, [data]);

  useEffect(() => {
    const pageNum = page ? Math.max(1, parseInt(page, 10)) - 1 : 0;
    setCurrentPage(pageNum);
  }, [location.pathname]);

  const total = data?.total ?? 0;
  const tickets = data?.data || [];

  const toggleArrangeType = () => {
    setArrangeType((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleChangeValueSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTransactionValue(e.target.value);
  }, 200);

  const handleSelectedTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as PaymentType);
  };

  const handlePageClick = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    setCurrentPage(selectedItem.selected);
    navigate(newPage > 1 ? `${urlMain}/page/${newPage}` : `${urlMain}`, {
      replace: true,
    });
  };

  const handleRedirectDetail = (id: number) => {
    navigate(`${urlMain}/detail/${id}`);
  };

  if (isLoading) return <Loading />;
  if (error) return <p className={styles.error}>Lỗi khi tải dữ liệu</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchInput placeholder="Tìm kiếm theo mã" onChange={handleChangeValueSearch} />
        <Link to={`${urlMain}/add`} className={styles["btn-add"]}>
          Thêm khuyến mãi
        </Link>
      </div>

      <div className={styles["filter-wrapper"]}>
        <SelectTypeTicket selectedType={selectedType} onChange={handleSelectedTypeChange} />
      </div>

      <div className={styles["table-wrapper"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2} className={styles["rowspan-center"]}>
                <div className={styles["numerical-order"]}>
                  <p>STT</p>
                  <GoTriangleDown
                    className={`${styles.icon} ${
                      arrangeType === "desc" ? styles.desc : styles.asc
                    }`}
                    onClick={toggleArrangeType}
                  />
                </div>
              </th>
              <th rowSpan={3} className={styles["rowspan-center"]}>
                Mã Giao dịch
              </th>
              <th rowSpan={3} className={styles["rowspan-center"]}>
                Tuyến xe
              </th>
              <th colSpan={2}>Người mua</th>
              <th colSpan={3}>Người nhận</th>
              <th rowSpan={3} className={styles["rowspan-center"]}>
                Loại thanh toán
              </th>
              <th rowSpan={3} className={styles["rowspan-center"]}>
                Trạng thái
              </th>
              <th rowSpan={3} className={styles["rowspan-center"]}>
                Giá tiền
              </th>
              <th rowSpan={3} className={styles["rowspan-center"]}>
                Thao Tác
              </th>
            </tr>
            <tr className={styles["sub-header"]}>
              {/* người mua */}
              <th className={styles["sub-header-col"]}>Họ và tên</th>
              <th className={styles["sub-header-col"]}>Email</th>
              {/* Người nhận */}
              <th className={styles["sub-header-col"]}>Họ và tên</th>
              <th className={styles["sub-header-col"]}>Email</th>
              <th className={styles["sub-header-col"]}>Số điện thoại</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket.id}>
                <td onClick={() => handleRedirectDetail(ticket?.id || 0)}>
                  {index + 1 + currentPage * ITEMS_PER_PAGE}
                </td>
                <td>{ticket.transactionId}</td>
                <td>{ticket.trip.name}</td>
                <td>{ticket.customer.fullName}</td>
                <td>{ticket.customer.email}</td>
                <td>{ticket.fullName}</td>
                <td>{ticket.email}</td>
                <td>{ticket.phone}</td>
                <td>{ticket.paymentType}</td>
                <td>{ticket.paymentStatus}</td>
                <td>{formatCurrency(ticket.price)}</td>
                <td>
                  <div className={styles["actions"]}>
                    <Link
                      to={`${urlMain}/detail/${ticket.id}`}
                      className={`${styles["btn-detail"]} ${styles.btn}`}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                    <Link
                      to={`${urlMain}/update/${ticket.id}`}
                      className={`${styles["btn-edit"]} ${styles.btn}`}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </Link>
                    <button className={`${styles["btn-delete"]} ${styles.btn}`}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <Pagination
          pageCount={Math.ceil(total / ITEMS_PER_PAGE)}
          onPageChange={handlePageClick}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default TicketManage;

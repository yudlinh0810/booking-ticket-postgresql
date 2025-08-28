export interface SliderObj {
  imgSrc: string;
  badgeText?: string;
  title?: string;
  link: string;
  isButton: boolean;
}

export const sliderData: SliderObj[] = [
  {
    imgSrc: "/images/promotion1.jpg",
    badgeText: "Ưu đãi",
    title: "UU ĐÃI ĐẶC BIỆT TẶNG VOUCHER 80K",
    link: "/",
    isButton: true,
  },
  {
    imgSrc: "/images/promotion2.jpg",
    badgeText: "Ưu đãi",
    title: "Khuyến mãi đặc biệt cho khách hàng mới",
    link: "/",
    isButton: false,
  },
  {
    imgSrc: "/images/promotion3.jpg",
    badgeText: "Ưu đãi",
    title: "Ưu đãi hấp dẫn trong tháng này",
    link: "/",
    isButton: true,
  },
  {
    imgSrc: "/images/promotion4.jpg",
    badgeText: "Ưu đãi",
    title: "Giảm giá lên đến 50% cho tất cả dịch vụ",
    link: "/",
    isButton: false,
  },
  {
    imgSrc: "/images/promotion2.jpg",
    badgeText: "Ưu đãi",
    title: "Chương trình loyalty cho khách hàng thân thiết",
    link: "/",
    isButton: true,
  },
];

export const urlLists = [
  {
    name: "home",
    url: "/",
  },
  {
    name: "products",
    url: "/products",
  },
  {
    name: "sidebar",
    url: "/sidebar",
  },
  {
    name: "halaman OTP",
    url: "/halamanOTP",
  },
  {
    name: "input",
    url: "/input",
  },
  {
    name: "API using",
    url: "/apiUsing",
  },
  {
    name: "Data Table",
    url: "/dataTable",
  },
];

export const sidebarUrl = [
  {
    name: "dasboard",
    value: "dasboard",
  },
  {
    name: "subscription",
    value: "subscription",
  },
  {
    name: "transporter",
    value: "transporter",
  },
  {
    name: "management mitra dan group",
    value: "mmg",
  },
  {
    name: "kontak harga",
    value: "kh",
    options: [
      { name: "kontrak dan penawaran", value: "kp" },
      { name: "order entry", value: "oe" },
    ],
  },
  {
    name: "tender",
    value: "tender",
    options: [
      { name: "info prea tender", value: "ipt" },
      { name: "proses tender", value: "pt" },
      { name: "SK pemenang tender", value: "skpt" },
      { name: "amandemen tender", value: "at" },
      { name: "daftar tender dan eksekusi", value: "dte" },
      { name: "order entry", value: "oet" },
    ],
  },
  {
    name: "instant order",
    value: "io",
    options: [
      { name: "lokasi truk siap muat", value: "ltsm" },
      { name: "info permintaan muat", value: "ipm" },
      { name: "order entry", value: "oei" },
    ],
  },
];

export const sideMenu = [
  {
    id: 1,
    title: "sembunyikan menu",
    icon: "../icons/chat.svg",
    open: true,
  },
  {
    id: 2,
    title: "dashboard",
    icon: "../icons/menu.svg",
    link: "/bubble",
  },
  {
    id: 3,
    title: "kelola produk",
    icon: "../icons/chat.svg",
    open: false,
    child: [
      { id: 1, title: "daftar produk", link: "/" },
      { id: 2, title: "atur produk massal", link: "/" },
      { id: 3, title: "daftar etalase", link: "/" },
      { id: 4, title: "analisa produk", link: "/" },
    ],
  },
  {
    id: 4,
    title: "kelola pesanan",
    icon: "../icons/Gift.svg",
    open: false,
    child: [
      { id: 1, title: "daftar pesanan", link: "/" },
      { id: 2, title: "pesanan dikomplain", link: "/" },
      { id: 3, title: "pesanan menunggu pembayaran", link: "/" },
    ],
  },
  {
    id: 5,
    title: "kelola pelanggan",
    icon: "../icons/manajemen-user.svg",
    open: false,
    child: [
      { id: 1, title: "diskusi", link: "/" },
      { id: 2, title: "ulasan pelanggan", link: "/" },
    ],
  },
  {
    id: 6,
    title: "pengaturan merchant",
    icon: "../icons/building.svg",
    open: false,
    child: [
      { id: 1, title: "atur jam opsional", link: "/" },
      { id: 2, title: "alamat pick up/manajemen lokasi", link: "/" },
      { id: 3, title: "opsi pengiriman", link: "/" },
      { id: 4, title: "manajemen verifikasi", link: "/" },
      { id: 5, title: "manajemen user", link: "/" },
      { id: 6, title: "manajemen role", link: "/" },
      { id: 7, title: "pusat bantuan", link: "/" },
    ],
  },
  {
    id: 7,
    title: "pusat promosi",
    icon: "../icons/voucher.svg",
    open: false,
    child: [
      { id: 1, title: "kelola voucher", link: "/" },
      { id: 2, title: "promosi penjual", link: "/" },
    ],
  },
  {
    id: 8,
    title: "faktur pajak",
    icon: "../icons/topik-amandemen.svg",
    link: "/bubble",
  },
];

export const sideMenuDemo = [
  {
    id: 1,
    title: "sembunyikan menu",
    icon: "../icons/chat.svg",
    open: true,
  },
  {
    id: 2,
    title: 'Button',
    icon: '../icons/menu.svg',
    link: '/buttons'
  },
  {
    id: 3,
    title: 'Bubble',
    icon: '../icons/menu.svg',
    link: '/bubble'
  },
  {
    id: 4,
    title: 'Badge',
    icon: '../icons/menu.svg',
    link: '/badges'
  },
  {
    id: 5,
    title: 'Checkbox',
    icon: '../icons/menu.svg',
    link: '/checkbox'
  },
  {
    id: 6,
    title: 'Radio',
    icon: '../icons/menu.svg',
    link: '/radio'
  },
  {
    id: 7,
    title: 'Input',
    icon: '../icons/menu.svg',
    link: '/input'
  },
  {
    id: 8,
    title: 'Textarea',
    icon: '../icons/menu.svg',
    link: '/textarea'
  },
  {
    id: 9,
    title: 'Tooltip',
    icon: '../icons/menu.svg',
    link: '/tooltip'
  },



];

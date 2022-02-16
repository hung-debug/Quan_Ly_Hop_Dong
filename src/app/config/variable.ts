export const variable = {
  stepSampleContract: {
    step_confirm_coordination: "confirm-coordination",
    step_coordination: "infor-coordination",
    step1: "infor-contract",
    step2: "determine-contract",
    step3: "sample-contract",
    step4: "confirm-contract",
  },
  stepBatchContract: {
    step_confirm_coordination: "confirm-coordination",
    step_coordination: "infor-coordination",
    step1: "infor-contract",
    step2: "confirm-contract",
  },
}

export const type_signature = [
  // {
  //   id: 1,
  //   name: "Ký ảnh",
  //   is_otp: false
  // },
  {
    id: 2,
    name: "Ký số bằng USB token",
    is_otp: false
  },
  {
    id: 3,
    name: "Ký số bằng sim PKI",
    is_otp: false
  },
  // {
  //   id: 4,
  //   name: "Ký số bằng HSM",
  //   is_otp: false
  // }
];

export const type_signature_personal_party = [
  {
    id: 1,
    name: "Ký ảnh",
    is_otp: false
  },
  {
    id: 2,
    name: "Ký số bằng USB token",
    is_otp: false
  },
  {
    id: 3,
    name: "Ký số bằng sim PKI",
    is_otp: false
  },
  // {
  //   id: 4,
  //   name: "Ký số bằng HSM",
  //   is_otp: false
  // }
]

export const type_signature_doc = [{
  id: 2,
  name: "Ký số bằng USB token",
  is_otp: false
}]

export var networkList = [
  { id : 1, name: 'Mobifone'},
  { id : 2, name: 'Viettel'},
  { id : 3, name: 'Vietnamobile'}
];

// export var roleList = [
//   {
//     //Nhóm chức năng quản lý hợp đồng
//     label: "role.contract.list", value: "QLHD",
//     items: [
//       //Thêm mới hợp đồng đơn lẻ
//       { label: "role.contract.add", value: "QLHD_01"},
//       //Sửa hợp đồng
//       // { label: "role.contract.edit", value: "QLHD_02"},
//       //Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con
//       // { label: "role.contract.view", value: "QLHD_03"},
//       //Xem danh sách hợp đồng của tổ chức của tôi
//       // { label: "role.contract.view.org", value: "QLHD_04"},
//       //Xem danh sách hợp đồng của tôi
//       // { label: "role.contract.view.me", value: "QLHD_05"},
//       //Tìm kiếm hợp đồng
//       { label: "role.contract.filter", value: "QLHD_06"},
//       //Xem thông tin chi tiết hợp đồng
//       { label: "role.contract.view.detail", value: "QLHD_07"},
//       //Sao chép hợp đồng
//       // { label: "role.contract.copy", value: "QLHD_08"},
//       //Hủy hợp đồng
//       { label: "role.contract.cancel", value: "QLHD_09"},
//       //Xem lịch sử hợp đồng
//       { label: "role.contract.view.history", value: "QLHD_10"},
//       //Tạo hợp đồng liên quan
//       { label: "role.contract.create.connect", value: "QLHD_11"},
//       //Xem hợp đồng liên quan
//       { label: "role.contract.view.connect", value: "QLHD_12"},
//       //Chia sẻ hợp đồng
//       { label: "role.contract.share", value: "QLHD_13"},
//     ]
//   },
//   // {
//   //   //Nhóm chức năng quản lý mẫu hợp đồng
//   //   label: "role.contract-template.list", value: "QLMHD",
//   //   items: [
//   //     //Thêm mới mẫu hợp đồng
//   //     { label: "role.contract-template.add", value: "QLMHD_01"},
//   //     //Sửa mẫu hợp đồng
//   //     { label: "role.contract-template.edit", value: "QLMHD_02"},
//   //     //Tạo hợp đồng đơn lẻ theo mẫu
//   //     { label: "role.contract-template.create-contract", value: "QLMHD_03"},
//   //     //Tạo hợp đồng theo lô
//   //     { label: "role.contract-template.create-batch", value: "QLMHD_04"},
//   //     //Ngừng phát hành mẫu hợp đồng
//   //     { label: "role.contract-template.stop", value: "QLMHD_05"},
//   //     //Phát hành mẫu hợp đồng
//   //     { label: "role.contract-template.start", value: "QLMHD_06"},
//   //     //Chia sẻ mẫu hợp đồng
//   //     { label: "role.contract-template.share", value: "QLMHD_07"},
//   //     //Tìm kiếm mẫu hợp đồng
//   //     { label: "role.contract-template.filter", value: "QLMHD_08"},
//   //     //Xóa mẫu hợp đồng
//   //     { label: "role.contract-template.delete", value: "QLMHD_09"},
//   //     //Xem thông tin chi tiết mẫu hợp đồng
//   //     { label: "role.contract-template.view.detail", value: "QLMHD_10"},
//   //   ]
//   // },
//   {
//     //Nhóm chức năng quản lý tổ chức
//     label: "role.unit.list", value: "QLTC",
//     items: [
//       //Thêm mới tổ chức
//       { label: "role.unit.add", value: "QLTC_01"},
//       //Sửa tổ chức
//       { label: "role.unit.edit", value: "QLTC_02"},
//       //Tìm kiếm tổ chức
//       { label: "role.unit.filter", value: "QLTC_03"},
//       //Xem thông tin chi tiết tổ chức
//       { label: "role.unit.view.detail", value: "QLTC_04"},
//     ]
//   },
//   {
//     //Nhóm chức năng quản lý người dùng
//     label: "role.user.list", value: "QLND",
//     items: [
//       //Thêm mới người dùng
//       { label: "role.user.add", value: "QLND_01"},
//       //Sửa người dùng
//       { label: "role.user.edit", value: "QLND_02"},
//       //Tìm kiếm người dùng
//       { label: "role.user.filter", value: "QLND_03"},
//       //Xem thông tin chi tiết người dùng
//       { label: "role.user.view.detail", value: "QLND_04"},
//     ]
//   },
//   {
//     //Nhóm chức năng quản lý vai trò
//     label: "role.list.v2", value: "QLVT",
//     items: [
//       //Thêm mới vai trò
//       { label: "role.add", value: "QLVT_01"},
//       //Sửa vai trò
//       { label: "role.edit", value: "QLVT_02"},
//       //Xóa vai trò
//       { label: "role.delete", value: "QLVT_03"},
//       //Tìm kiếm vai trò
//       { label: "role.filter", value: "QLVT_04"},
//       //Xem thông tin chi tiết vai trò
//       { label: "role.view.detail", value: "QLVT_05"},
//     ]
//   },
//   {
//     //Nhóm chức năng quản lý loại hợp đồng
//     label: "role.contract-type.list", value: "QLLHD",
//     items: [
//       //Thêm mới loại hợp đồng
//       { label: "role.contract-type.add", value: "QLLHD_01"},
//       //Sửa loại hợp đồng
//       { label: "role.contract-type.edit", value: "QLLHD_02"},
//       //Xóa loại hợp đồng
//       { label: "role.contract-type.delete", value: "QLLHD_03"},
//       //Tìm kiếm loại hợp đồng
//       { label: "role.contract-type.filter", value: "QLLHD_04"},
//       //Xem thông tin chi tiết loại hợp đồng
//       { label: "role.contract-type.view.detail", value: "QLLHD_05"},
//     ]
//   }
// ]

export var roleList = [
  {
    //Nhóm chức năng quản lý hợp đồng
    label: "Nhóm chức năng quản lý hợp đồng", value: "QLHD",
    items: [
      //Thêm mới hợp đồng đơn lẻ
      { label: "Thêm mới hợp đồng đơn lẻ", value: "QLHD_01"},
      //Sửa hợp đồng
      // { label: "Sửa hợp đồng", value: "QLHD_02"},
      //Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con
      // { label: "Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con", value: "QLHD_03"},
      //Xem danh sách hợp đồng của tổ chức của tôi
      // { label: "Xem danh sách hợp đồng của tổ chức của tôi", value: "QLHD_04"},
      //Xem danh sách hợp đồng của tôi
      // { label: "Xem danh sách hợp đồng của tôi", value: "QLHD_05"},
      //Tìm kiếm hợp đồng
      { label: "Tìm kiếm hợp đồng", value: "QLHD_06"},
      //Xem thông tin chi tiết hợp đồng
      { label: "Xem thông tin chi tiết hợp đồng", value: "QLHD_07"},
      //Sao chép hợp đồng
      // { label: "Sao chép hợp đồng", value: "QLHD_08"},
      //Hủy hợp đồng
      { label: "Hủy hợp đồng", value: "QLHD_09"},
      //Xem lịch sử hợp đồng
      { label: "Xem lịch sử hợp đồng", value: "QLHD_10"},
      //Tạo hợp đồng liên quan
      { label: "Tạo hợp đồng liên quan", value: "QLHD_11"},
      //Xem hợp đồng liên quan
      { label: "Xem hợp đồng liên quan", value: "QLHD_12"},
      //Chia sẻ hợp đồng
      { label: "Chia sẻ hợp đồng", value: "QLHD_13"},
    ]
  },
  // {
  //   //Nhóm chức năng quản lý mẫu hợp đồng
  //   label: "Nhóm chức năng quản lý mẫu hợp đồng", value: "QLMHD",
  //   items: [
  //     //Thêm mới mẫu hợp đồng
  //     { label: "Thêm mới mẫu hợp đồng", value: "QLMHD_01"},
  //     //Sửa mẫu hợp đồng
  //     { label: "Sửa mẫu hợp đồng", value: "QLMHD_02"},
  //     //Tạo hợp đồng đơn lẻ theo mẫu
  //     { label: "Tạo hợp đồng đơn lẻ theo mẫu", value: "QLMHD_03"},
  //     //Tạo hợp đồng theo lô
  //     { label: "Tạo hợp đồng theo lô", value: "QLMHD_04"},
  //     //Ngừng phát hành mẫu hợp đồng
  //     { label: "Ngừng phát hành mẫu hợp đồng", value: "QLMHD_05"},
  //     //Phát hành mẫu hợp đồng
  //     { label: "Phát hành mẫu hợp đồng", value: "QLMHD_06"},
  //     //Chia sẻ mẫu hợp đồng
  //     { label: "Chia sẻ mẫu hợp đồng", value: "QLMHD_07"},
  //     //Tìm kiếm mẫu hợp đồng
  //     { label: "Tìm kiếm mẫu hợp đồng", value: "QLMHD_08"},
  //     //Xóa mẫu hợp đồng
  //     { label: "Xóa mẫu hợp đồng", value: "QLMHD_09"},
  //     //Xem thông tin chi tiết mẫu hợp đồng
  //     { label: "Xem thông tin chi tiết mẫu hợp đồng", value: "QLMHD_10"},
  //   ]
  // },
  {
    //Nhóm chức năng quản lý tổ chức
    label: "Nhóm chức năng quản lý tổ chức", value: "QLTC",
    items: [
      //Thêm mới tổ chức
      { label: "Thêm mới tổ chức", value: "QLTC_01"},
      //Sửa tổ chức
      { label: "Sửa tổ chức", value: "QLTC_02"},
      //Tìm kiếm tổ chức
      { label: "Tìm kiếm tổ chức", value: "QLTC_03"},
      //Xem thông tin chi tiết tổ chức
      { label: "Xem thông tin chi tiết tổ chức", value: "QLTC_04"},
    ]
  },
  {
    //Nhóm chức năng quản lý người dùng
    label: "Nhóm chức năng quản lý người dùng", value: "QLND",
    items: [
      //Thêm mới người dùng
      { label: "Thêm mới người dùng", value: "QLND_01"},
      //Sửa người dùng
      { label: "Sửa người dùng", value: "QLND_02"},
      //Tìm kiếm người dùng
      { label: "Tìm kiếm người dùng", value: "QLND_03"},
      //Xem thông tin chi tiết người dùng
      { label: "Xem thông tin chi tiết người dùng", value: "QLND_04"},
    ]
  },
  {
    //Nhóm chức năng quản lý vai trò
    label: "Nhóm chức năng quản lý vai trò", value: "QLVT",
    items: [
      //Thêm mới vai trò
      { label: "Thêm mới vai trò", value: "QLVT_01"},
      //Sửa vai trò
      { label: "Sửa vai trò", value: "QLVT_02"},
      //Xóa vai trò
      { label: "Xóa vai trò", value: "QLVT_03"},
      //Tìm kiếm vai trò
      { label: "Tìm kiếm vai trò", value: "QLVT_04"},
      //Xem thông tin chi tiết vai trò
      { label: "Xem thông tin chi tiết vai trò", value: "QLVT_05"},
    ]
  },
  {
    //Nhóm chức năng quản lý loại hợp đồng
    label: "Nhóm chức năng quản lý loại hợp đồng", value: "QLLHD",
    items: [
      //Thêm mới loại hợp đồng
      { label: "Thêm mới loại hợp đồng", value: "QLLHD_01"},
      //Sửa loại hợp đồng
      { label: "Sửa loại hợp đồng", value: "QLLHD_02"},
      //Xóa loại hợp đồng
      { label: "Xóa loại hợp đồng", value: "QLLHD_03"},
      //Tìm kiếm loại hợp đồng
      { label: "Tìm kiếm loại hợp đồng", value: "QLLHD_04"},
      //Xem thông tin chi tiết loại hợp đồng
      { label: "Xem thông tin chi tiết loại hợp đồng", value: "QLLHD_05"},
    ]
  }
]

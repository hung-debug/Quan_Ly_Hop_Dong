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

export var roleList = [
  {
    label: "role.contract.list", value: "QLHD", mean: "Nhóm chức năng quản lý hợp đồng",
    items: [
      { label: "role.contract.add", value: "QLHD_01", mean: "Thêm mới hợp đồng đơn lẻ"},
      // { label: "role.contract.edit", value: "QLHD_02" , mean: "Sửa hợp đồng"},
      // { label: "role.contract.view", value: "QLHD_03", mean: "Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con"},
      // { label: "role.contract.view.org", value: "QLHD_04", mean: "Xem danh sách hợp đồng của tổ chức của tôi"},
      // { label: "role.contract.view.me", value: "QLHD_05", mean: "Xem danh sách hợp đồng của tôi"},
      { label: "role.contract.filter", value: "QLHD_06", mean: "Tìm kiếm hợp đồng"},
      { label: "role.contract.view.detail", value: "QLHD_07", mean: "Xem thông tin chi tiết hợp đồng"},
      // { label: "role.contract.copy", value: "QLHD_08", mean: "Sao chép hợp đồng"},
      { label: "role.contract.cancel", value: "QLHD_09", mean: "Huỷ hợp đồng"},
      { label: "role.contract.view.history", value: "QLHD_10", mean: "Xem lịch sử hợp đồng"},
      // { label: "role.contract.create.connect", value: "QLHD_11", mean: "Tạo hợp đồng liên quan"},
      { label: "role.contract.view.connect", value: "QLHD_12", mean: "Xem hợp đồng liên quan"},
      { label: "role.contract.share", value: "QLHD_13", mean: "Chia sẻ hợp đồng"},
    ]
  },
  // {
  //   label: "role.contract-template.list", value: "QLMHD", mean: "Nhóm chức năng quản lý mẫu hợp đồng",
  //   items: [
  //     { label: "role.contract-template.add", value: "QLMHD_01", mean: "Thêm mới mẫu hợp đồng"},
  //     { label: "role.contract-template.edit", value: "QLMHD_02", mean: "Sửa mẫu hợp đồng"},
  //     { label: "role.contract-template.create-contract", value: "QLMHD_03", mean: "Tạo hợp đồng đơn lẻ theo mẫu"},
  //     { label: "role.contract-template.create-batch", value: "QLMHD_04", mean: "Tạo hợp đồng theo lô"},
  //     { label: "role.contract-template.stop", value: "QLMHD_05", mean: "Ngừng phát hành mẫu hợp đồng"},
  //     { label: "role.contract-template.start", value: "QLMHD_06", mean: "Phát hành mẫu hợp đồng"},
  //     { label: "role.contract-template.share", value: "QLMHD_07", mean: "Chia sẻ mẫu hợp đồng"},
  //     { label: "role.contract-template.filter", value: "QLMHD_08", mean: "Tìm kiếm mẫu hợp đồng"},
  //     { label: "role.contract-template.delete", value: "QLMHD_09", mean: "Xóa mẫu hợp đồng"},
  //     { label: "role.contract-template.view.detail", value: "QLMHD_10", mean: "Xem thông tin chi tiết mẫu hợp đồng"},
  //   ]
  // },
  {
    label: "role.unit.list", value: "QLTC", mean: "Nhóm chức năng quản lý tổ chức",
    items: [
      { label: "role.unit.add", value: "QLTC_01", mean: "Thêm mới tổ chức"},
      { label: "role.unit.edit", value: "QLTC_02", mean: "Sửa tổ chức"},
      { label: "role.unit.filter", value: "QLTC_03", mean: "Tìm kiếm tổ chức"},
      { label: "role.unit.view.detail", value: "QLTC_04", mean: "Xem thông tin chi tiết tổ chức"},
    ]
  },
  {
    label: "role.user.list", value: "QLND", mean: "Nhóm chức năng quản lý người dùng",
    items: [
      { label: "role.user.add", value: "QLND_01", mean: "Thêm mới người dùng"},
      { label: "role.user.edit", value: "QLND_02", mean: "Sửa người dùng"},
      { label: "role.user.filter", value: "QLND_03", mean: "Tìm kiếm người dùng"},
      { label: "role.user.view.detail", value: "QLND_04", mean: "Xem thông tin chi tiết người dùng"},
    ]
  },
  {
    label: "role.list.v2", value: "QLVT", mean: "Nhóm chức năng quản lý vai trò",
    items: [
      { label: "role.add", value: "QLVT_01", mean: "Thêm mới vai trò"},
      { label: "role.edit", value: "QLVT_02", mean: "Sửa vai trò"},
      { label: "role.delete", value: "QLVT_03", mean: "Xóa vai trò"},
      { label: "role.filter", value: "QLVT_04", mean: "Tìm kiếm vai trò"},
      { label: "role.view.detail", value: "QLVT_05", mean: "Xem thông tin chi tiết vai trò"},
    ]
  },
  {
    label: "role.contract-type.list", value: "QLLHD", mean: "Nhóm chức năng quản lý loại hợp đồng",
    items: [
      { label: "role.contract-type.add", value: "QLLHD_01", mean: "Thêm mới loại hợp đồng"},
      { label: "role.contract-type.edit", value: "QLLHD_02", mean: "Sửa loại hợp đồng"},
      { label: "role.contract-type.delete", value: "QLLHD_03", mean: "Xóa loại hợp đồng"},
      { label: "role.contract-type.filter", value: "QLLHD_04", mean: "Tìm kiếm loại hợp đồng"},
      { label: "role.contract-type.view.detail", value: "QLLHD_05", mean: "Xem thông tin chi tiết loại hợp đồng"},
    ]
  }
]

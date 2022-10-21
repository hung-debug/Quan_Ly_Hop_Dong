export const variable = {
  stepSampleContract: {
    step_confirm_coordination: 'confirm-coordination',
    step_coordination: 'infor-coordination',
    step1: 'infor-contract',
    step2: 'determine-contract',
    step3: 'sample-contract',
    step4: 'confirm-contract',
  },

  stepSampleContractForm: {
    step1: 'infor-contract-form',
    step2: 'party-contract-form',
    step3: 'sample-contract-form',
    step4: 'confirm-contract-form',
  },

  stepSampleContractBatch: {
    step1: 'infor-contract-batch',
    step2: 'confirm-contract-batch',
  },
};

export const type_signature = [
  {
    id: 1,
    name: 'Ký ảnh và OTP',
    is_otp: false,
  },
  {
    id: 5,
    name: "Ký eKYC",
    is_otp: false
  },
  // {
  //   id: 4,
  //   name: 'Ký số bằng HSM',
  //   is_otp: false
  // },
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },

];

export const type_signature_personal_party = [
  {
    id: 1,
    name: 'Ký ảnh và OTP',
    is_otp: false,
  },
  {
    id: 5,
    name: "Ký eKYC",
    is_otp: false
  },
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },
];

export const type_signature_doc = [
  // {
  //   id: 1,
  //   name: 'Ký ảnh và OTP',
  //   is_otp: false,
  // },
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
];

export const type_signature_template = [
  // {
  //   id: 1,
  //   name: 'Ký ảnh và OTP',
  //   is_otp: false,
  // },
  // {
  //   id: 5,
  //   name: "Ký eKYC",
  //   is_otp: false
  // },
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },

];

export const type_signature_personal_party_template = [
  // {
  //   id: 1,
  //   name: 'Ký ảnh và OTP',
  //   is_otp: false,
  // },
  // {
  //   id: 5,
  //   name: "Ký eKYC",
  //   is_otp: false
  // },
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
  {
    id: 3,
    name: 'Ký số bằng sim PKI',
    is_otp: false,
  },
];

export const type_signature_doc_template = [
  {
    id: 2,
    name: 'Ký số bằng USB token',
    is_otp: false,
  },
];

export var networkList = [
  { id: 1, name: 'Mobifone' },
  { id: 2, name: 'Viettel' },
  // { id: 3, name: 'Vietnamobile' },
];

export var statusList = [
  { id: 0, name: 'Tất cả' },
  { id: 1, name: 'Hoạt động' },
  { id: 2, name: 'Ngừng hoạt động' },
];

export var theThucTinhList = [
  { id: 1, name: 'Theo thời gian' },
  { id: 2, name: 'Theo số lượng hợp đồng' },
];

export var loaiGoiDichVuList = [
  { id: 1, name: 'Bình thường' },
  { id: 2, name: 'Khuyến mại' },
];

export var paidTypeList = [
  {id: 'PRE', name:'Trả trước'},
  {id:'POST', name:'Trả sau'}
]

export var paidStatusList = [
  {id:'UNPAID', name:'Chưa thanh toán'},
  {id:'PAID', name:'Đã thanh toán'}
]

export var fileCeCaOptions = [
  {id: 'NONE', name:'Không đẩy HĐ nào'},
  {id: 'ALL', name: 'Đẩy toàn bộ hợp đồng'},
  {id: 'SELECTION', name: 'Tuỳ biến'}
]

export var sideList = [
  {id:'1', name:'A'}, {id:'2', name:'B'}, {id:'3', name:'C'}, {id:'4', name:'D'},
  {id:'5', name:'E'}, {id:'6', name:'F'}, {id:'7', name:'G'}, {id:'8', name:'H'},
  {id:'9', name:'I'}, {id:'10', name:'J'}, {id:'11', name:'K'}, {id:'12', name:'L'},
  {id:'13', name:'M'}, {id:'14', name:'N'}, {id:'15', name:'O'}, {id:'16', name:'P'},
  {id:'17', name:'Q'}, {id:'18', name:'R'}, {id:'19', name:'S'}, {id:'20', name:'T'},
  {id:'21', name:'U'}, {id:'22', name:'V'}, {id:'23', name:'W'}, {id:'24', name:'X'},
  {id:'25', name:'Y'}, {id:'26', name:'Z'}
]

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
    label: 'Nhóm chức năng quản lý hợp đồng',
    value: 'QLHD',
    items: [
      //Thêm mới hợp đồng đơn lẻ không theo mẫu
      { label: 'Thêm mới hợp đồng đơn lẻ không theo mẫu', value: 'QLHD_01' },
      //Thêm mới hợp đồng đơn lẻ theo mẫu
      { label: 'Thêm mới hợp đồng đơn lẻ theo mẫu', value: 'QLHD_14' },
      //Thêm mới hợp đồng theo lô
      { label: 'Thêm mới hợp đồng theo lô', value: 'QLHD_15' },
      //Sửa hợp đồng
      { label: 'Sửa hợp đồng', value: 'QLHD_02' },
      //Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con
      {
        label: 'Xem danh sách hợp đồng của tổ chức của tôi và tổ chức con',
        value: 'QLHD_03',
      },
      //Xem danh sách hợp đồng của tổ chức của tôi
      { label: 'Xem danh sách hợp đồng của tổ chức của tôi', value: 'QLHD_04' },
      //Xem danh sách hợp đồng của tôi
      { label: 'Xem danh sách hợp đồng của tôi', value: 'QLHD_05' },
      //Tìm kiếm hợp đồng
      { label: 'Tìm kiếm hợp đồng', value: 'QLHD_06' },
      //Xem thông tin chi tiết hợp đồng
      { label: 'Xem thông tin chi tiết hợp đồng', value: 'QLHD_07' },
      //Sao chép hợp đồng
      { label: 'Sao chép hợp đồng', value: 'QLHD_08' },
      //Hủy hợp đồng
      { label: 'Hủy hợp đồng', value: 'QLHD_09' },
      //Xem lịch sử hợp đồng
      { label: 'Xem lịch sử hợp đồng', value: 'QLHD_10' },
      //Tạo hợp đồng liên quan
      { label: 'Tạo hợp đồng liên quan', value: 'QLHD_11' },
      //Xem hợp đồng liên quan
      { label: 'Xem hợp đồng liên quan', value: 'QLHD_12' },
      //Chia sẻ hợp đồng
      { label: 'Chia sẻ hợp đồng', value: 'QLHD_13' },
    ],
  },
  {
    //Nhóm chức năng quản lý mẫu hợp đồng
    label: "Nhóm chức năng quản lý mẫu hợp đồng", value: "QLMHD",
    items: [
      //Thêm mới mẫu hợp đồng
      { label: "Thêm mới mẫu hợp đồng", value: "QLMHD_01"},
      //Sửa mẫu hợp đồng
      { label: "Sửa mẫu hợp đồng", value: "QLMHD_02"},
      //Ngừng phát hành mẫu hợp đồng
      { label: "Ngừng phát hành mẫu hợp đồng", value: "QLMHD_03"},
      //Phát hành mẫu hợp đồng
      { label: "Phát hành mẫu hợp đồng", value: "QLMHD_04"},
      //Chia sẻ mẫu hợp đồng
      { label: "Chia sẻ mẫu hợp đồng", value: "QLMHD_05"},
      //Tìm kiếm mẫu hợp đồng
      { label: "Tìm kiếm mẫu hợp đồng", value: "QLMHD_06"},
      //Xóa mẫu hợp đồng
      { label: "Xóa mẫu hợp đồng", value: "QLMHD_07"},
      //Xem thông tin chi tiết mẫu hợp đồng
      { label: "Xem thông tin chi tiết mẫu hợp đồng", value: "QLMHD_08"},
    ]
  },
  {
    //Nhóm chức năng quản lý tổ chức
    label: 'Nhóm chức năng quản lý tổ chức',
    value: 'QLTC',
    items: [
      //Thêm mới tổ chức
      { label: 'Thêm mới tổ chức', value: 'QLTC_01' },
      //Sửa tổ chức
      { label: 'Sửa tổ chức', value: 'QLTC_02' },
      //Tìm kiếm tổ chức
      { label: 'Tìm kiếm tổ chức', value: 'QLTC_03' },
      //Xem thông tin chi tiết tổ chức
      { label: 'Xem thông tin chi tiết tổ chức', value: 'QLTC_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý người dùng
    label: 'Nhóm chức năng quản lý người dùng',
    value: 'QLND',
    items: [
      //Thêm mới người dùng
      { label: 'Thêm mới người dùng', value: 'QLND_01' },
      //Sửa người dùng
      { label: 'Sửa người dùng', value: 'QLND_02' },
      //Tìm kiếm người dùng
      { label: 'Tìm kiếm người dùng', value: 'QLND_03' },
      //Xem thông tin chi tiết người dùng
      { label: 'Xem thông tin chi tiết người dùng', value: 'QLND_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý vai trò
    label: 'Nhóm chức năng quản lý vai trò',
    value: 'QLVT',
    items: [
      //Thêm mới vai trò
      { label: 'Thêm mới vai trò', value: 'QLVT_01' },
      //Sửa vai trò
      { label: 'Sửa vai trò', value: 'QLVT_02' },
      //Xóa vai trò
      { label: 'Xóa vai trò', value: 'QLVT_03' },
      //Tìm kiếm vai trò
      { label: 'Tìm kiếm vai trò', value: 'QLVT_04' },
      //Xem thông tin chi tiết vai trò
      { label: 'Xem thông tin chi tiết vai trò', value: 'QLVT_05' },
    ],
  },
  {
    //Nhóm chức năng quản lý loại hợp đồng
    label: 'Nhóm chức năng quản lý loại hợp đồng',
    value: 'QLLHD',
    items: [
      //Thêm mới loại hợp đồng
      { label: 'Thêm mới loại hợp đồng', value: 'QLLHD_01' },
      //Sửa loại hợp đồng
      { label: 'Sửa loại hợp đồng', value: 'QLLHD_02' },
      //Xóa loại hợp đồng
      { label: 'Xóa loại hợp đồng', value: 'QLLHD_03' },
      //Tìm kiếm loại hợp đồng
      { label: 'Tìm kiếm loại hợp đồng', value: 'QLLHD_04' },
      //Xem thông tin chi tiết loại hợp đồng
      { label: 'Xem thông tin chi tiết loại hợp đồng', value: 'QLLHD_05' },
    ],
  },
];

export var adminRoleList = [
  {
    //Nhóm chức năng quản lý tổ chức
    label: 'Nhóm chức năng quản lý tổ chức',
    value: 'QLTC',
    items: [
      //Thêm mới tổ chức
      { label: 'Thêm mới tổ chức', value: 'QLTC_01' },
      //Sửa tổ chức
      { label: 'Sửa tổ chức', value: 'QLTC_02' },
      //Thêm mới gói dịch vụ cho tổ chức
      { label: 'Thêm mới gói dịch vụ cho tổ chức', value: 'QLTC_03' },
      //Sửa gói dịch vụ cho tổ chức
      { label: 'Sửa gói dịch vụ cho tổ chức', value: 'QLTC_04' },
      //Theo dõi các gói dịch vụ
      { label: 'Theo dõi các gói dịch vụ', value: 'QLTC_05' },
      //Hủy gói dịch vụ của tổ chức
      { label: 'Hủy gói dịch vụ của tổ chức', value: 'QLTC_06' },
      //Xóa tổ chức
      { label: 'Xóa tổ chức', value: 'QLTC_07' },
      //Kích hoạt tổ chức
      { label: 'Kích hoạt tổ chức', value: 'QLTC_08' },
      //Tìm kiếm tổ chức
      { label: 'Tìm kiếm tổ chức', value: 'QLTC_09' },
      //Xem thông tin chi tiết tổ chức
      { label: 'Xem thông tin chi tiết tổ chức', value: 'QLTC_10' },
    ],
  },
  {
    //Nhóm chức năng quản lý người dùng
    label: 'Nhóm chức năng quản lý người dùng',
    value: 'QLND',
    items: [
      //Thêm mới người dùng
      { label: 'Thêm mới người dùng', value: 'QLND_01' },
      //Sửa người dùng
      { label: 'Sửa người dùng', value: 'QLND_02' },
      //Tìm kiếm người dùng
      { label: 'Tìm kiếm người dùng', value: 'QLND_03' },
      //Xem thông tin chi tiết người dùng
      { label: 'Xem thông tin chi tiết người dùng', value: 'QLND_04' },
    ],
  },
  {
    //Nhóm chức năng quản lý gói dịch vụ
    label: 'Nhóm chức năng quản lý gói dịch vụ',
    value: 'QLGDV',
    items: [
      //Thêm mới gói dịch vụ
      { label: 'Thêm mới gói dịch vụ', value: 'QLGDV_01' },
      //Sửa gói dịch vụ
      { label: 'Sửa gói dịch vụ', value: 'QLGDV_02' },
      //Tìm kiếm gói dịch vụ
      { label: 'Tìm kiếm gói dịch vụ', value: 'QLGDV_03' },
      //Xem thông tin chi tiết gói dịch vụ
      { label: 'Xem thông tin chi tiết gói dịch vụ', value: 'QLGDV_04' },
      //Xóa gói dịch vụ
      { label: 'Xóa gói dịch vụ', value: 'QLGDV_05' },
    ],
  },
  {
    //Nhóm chức năng quản lý thông báo
    label: 'Nhóm chức năng quản lý thông báo',
    value: 'QLTB',
    items: [
      //Xem thông báo
      { label: 'Xem thông báo', value: 'QLTB_01' },
    ],
  },
];

export const chu_ky_anh = "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"

export const chu_ky_so = "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";
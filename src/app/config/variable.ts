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
    label: "role.contract.list",
    value: "QLHD",
    items: [
      { label: "role.contract.add", value: "QLHD_01" },
      // { label: "role.contract.edit", value: "QLHD_02" },
      // { label: "role.contract.view", value: "QLHD_03" },
      // { label: "role.contract.view.org", value: "QLHD_04" },
      // { label: "role.contract.view.me", value: "QLHD_05" },
      { label: "role.contract.filter", value: "QLHD_06" },
      { label: "role.contract.view.detail", value: "QLHD_07" },
      // { label: "role.contract.copy", value: "QLHD_08" },
      { label: "role.contract.cancel", value: "QLHD_09" },
      { label: "role.contract.view.history", value: "QLHD_10" },
      // { label: "role.contract.create.connect", value: "QLHD_11" },
      { label: "role.contract.view.connect", value: "QLHD_12" },
      { label: "role.contract.share", value: "QLHD_13" }
    ]
  },
  // {
  //   label: "role.contract-template.list",
  //   value: "QLMHD",
  //   items: [
  //     { label: "role.contract-template.add", value: "QLMHD_01" },
  //     { label: "role.contract-template.edit", value: "QLMHD_02" },
  //     { label: "role.contract-template.create-contract", value: "QLMHD_03" },
  //     { label: "role.contract-template.create-batch", value: "QLMHD_04" },
  //     { label: "role.contract-template.stop", value: "QLMHD_05" },
  //     { label: "role.contract-template.start", value: "QLMHD_06" },
  //     { label: "role.contract-template.share", value: "QLMHD_07" },
  //     { label: "role.contract-template.filter", value: "QLMHD_08" },
  //     { label: "role.contract-template.delete", value: "QLMHD_09" },
  //     { label: "role.contract-template.view.detail", value: "QLMHD_10" }
  //   ]
  // },
  {
    label: "role.unit.list",
    value: "QLTC",
    items: [
      { label: "role.unit.add", value: "QLTC_01" },
      { label: "role.unit.edit", value: "QLTC_02" },
      { label: "role.unit.filter", value: "QLTC_03" },
      { label: "role.unit.view.detail", value: "QLTC_04" }
    ]
  },
  {
    label: "role.user.list",
    value: "QLND",
    items: [
      { label: "role.user.add", value: "QLND_01" },
      { label: "role.user.edit", value: "QLND_02" },
      { label: "role.user.filter", value: "QLND_03" },
      { label: "role.user.view.detail", value: "QLND_04" }
    ]
  },
  {
    label: "role.list.v2",
    value: "QLVT",
    items: [
      { label: "role.add", value: "QLVT_01" },
      { label: "role.edit", value: "QLVT_02" },
      { label: "role.delete", value: "QLVT_03" },
      { label: "role.filter", value: "QLVT_04" },
      { label: "role.view.detail", value: "QLVT_05" }
    ]
  },
  {
    label: "role.contract-type.list",
    value: "QLLHD",
    items: [
      { label: "role.contract-type.add", value: "QLLHD_01" },
      { label: "role.contract-type.edit", value: "QLLHD_02" },
      { label: "role.contract-type.delete", value: "QLLHD_03" },
      { label: "role.contract-type.filter", value: "QLLHD_04" },
      { label: "role.contract-type.view.detail", value: "QLLHD_05" }
    ]
  }
]

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
    name: "Ký số bằng sim KPI",
    is_otp: false
  },
  {
    id: 4,
    name: "Ký số bằng HSM",
    is_otp: false
  }
]

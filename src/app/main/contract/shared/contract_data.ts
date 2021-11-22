export const data_create_contract_determine =
  [
    {
      "name": "", // tên bên tham gia
      "type": 1, // loại bên tham gia: tổ chức của tôi | đối tác | cá nhân
      "ordering": 1, // thứ tự thực hiện ký kết của các bên tham gia
      "recipients": [
        // Dữ liệu người xem xét
        {
          "name": "", // tên người tham gia
          "email": "", // email người tham gia
          "phone": "", // sđt người tham gia
          "role": 1, // loại tham gia: xem xét|điều phối| ký | văn thư
          "ordering": 1, // thứ tự thực hiện của người tham gia
          "status": 1, // Trạng thái chưa xử lý/ đã xử lý
          "username": "", // username khi click từ link email
          "password": "", // pw click từ link email
          "is_otp": 1, // select otp
          "sign_type": [ // hình thức ký
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // Dữ liệu người ký
        {
          "name": "", // tên người tham gia
          "email": "", // email người tham gia
          "phone": "", // sđt người tham gia
          "role": 3, // loại tham gia: xem xét|điều phối| ký | văn thư
          "ordering": 1, // thứ tự thực hiện của người tham gia
          "status": 1, // Trạng thái chưa xử lý/ đã xử lý
          "username": "thangbt", // username khi click từ link email
          "password": "ad", // pw click từ link email
          "is_otp": 1, // select otp
          "sign_type": [ // hình thức ký
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // dữ liệu văn thư
        {
          "name": "", // tên người tham gia
          "email": "", // email người tham gia
          "phone": "", // sđt người tham gia
          "role": 4, // loại tham gia: xem xét|điều phối| ký | văn thư
          "ordering": 1, // thứ tự thực hiện của người tham gia
          "status": 1, // Trạng thái chưa xử lý/ đã xử lý
          "username": "", // username khi click từ link email
          "password": "", // pw click từ link email
          "is_otp": 1, // select otp
          "sign_type": [ // hình thức ký
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
      ],
    },
    // Đối tác
    // Tổ chức
    {
      "name": "",
      "type": 2, // Đối tác tổ chức
      "ordering": 1,
      "recipients": [
        // người điều phối
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 2, // người điều phối
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // người xem xét
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 1, // người xem xét
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // người ký
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 3, // người ký
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // văn thư
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 4, // văn thư
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        }
      ],
    },
    {
      "name": "",
      "type": 3, // Đối tác cá nhân
      "ordering": 1,
      "recipients": [
        // người điều phối
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 2, // người điều phối
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // người xem xét
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 1, // người xem xét
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // người ký
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 3, // người ký
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        },
        // văn thư
        {
          "name": "",
          "email": "",
          "phone": "",
          "role": 4, // văn thư
          "ordering": 1,
          "status": 1,
          "username": "",
          "password": "",
          "is_otp": 1,
          "sign_type": [
            {
              "id": 1,
              "name":"Ký ảnh"
            },
            {
              "id": 2,
              "name":"Ký số bằng USB token"
            },
            {
              id: 3,
              name: "Ký số bằng sim KPI"
            },
            {
              id: 4,
              name: "Ký số bằng HSM"
            }
          ]
        }
      ],
    }
  ]


export const data_create_contract_determine =
  [
    {
      "name": "ullamco id sed ad aliquip", // tên bên tham gia
      "type": 1, // loại bên tham gia: tổ chức của tôi | đối tác | cá nhân
      "ordering": 1, // thứ tự thực hiện ký kết của các bên tham gia
      "recipients": [
        {
          "name": "Đặng Văn Thắng", // tên người tham gia
          "email": "thangdv@google.com", // email người tham gia
          "phone": "0922000345", // sđt người tham gia
          "role": 1, // loại tham gia: xem xét|điều phối| ký | văn thư
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
              "name":"Ký số"
            }
          ]
        },
        {
          "name": "Đặng Văn Thắng", // tên người tham gia
          "email": "thangdv@google.com", // email người tham gia
          "phone": "0922000345", // sđt người tham gia
          "role": 2, // loại tham gia: xem xét|điều phối| ký | văn thư
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
              "name":"Ký số"
            }
          ]
        }
      ],
    },
    // {
    //   "type": 2,
    //   "ordering": 1,
    //   "recipients": [
    //     {
    //       "name": "Trần Tuấn Anh",
    //       "email": "anhtt@facebook.com",
    //       "phone": "0982100347",
    //       "role": 1,
    //       "ordering": 1,
    //       "status": 1,
    //       "username": "anhtt@facebook.com",
    //       "password": "dasf",
    //       "is_otp": 1,
    //       "sign_type": [
    //         {
    //           "id": 1,
    //           "name":"Ký ảnh"
    //         },
    //         {
    //           "id": 2,
    //           "name":"Ký số"
    //         }
    //       ]
    //     }
    //   ],
    //   "name": "magna minim irure labore"
    // }
  ]


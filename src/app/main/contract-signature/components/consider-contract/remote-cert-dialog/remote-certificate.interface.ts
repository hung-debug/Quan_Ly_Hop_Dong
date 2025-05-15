export interface RemoteCertificate {
    name: string; // Tên chủ sở hữu (có thể dùng thay subjectName)
    company: string;
    mst: string; // Có thể chứa MST hoặc CCCD dạng "CCCD:..."
    cccd: string;
    cmnd: string;
    dataCert: string; // Có thể là base64 của cert, tùy API
    serialNumber: string; // Serial Number
    issuer: string; // Tên đơn vị cấp (có thể dùng thay issuerName)
    validFrom: string; // Ngày bắt đầu hiệu lực
    validTo: string; // Ngày hết hạn hiệu lực
    position: string; // Có thể không liên quan đến việc chọn cert
}
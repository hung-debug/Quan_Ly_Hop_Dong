import { Component, ElementRef, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-image-cropperv2', 
  templateUrl: './image-cropperv2.component.html',
  styleUrls: ['./image-cropperv2.component.scss']
})
export class ImageCropperComponentv2 implements AfterViewInit {
  // ViewChild để lấy tham chiếu đến các phần tử HTML
  @ViewChild('imageCanvas', { static: true }) imageCanvas: ElementRef<HTMLCanvasElement>; // Tham chiếu đến canvas hiển thị ảnh
  @ViewChild('cropCanvas', { static: true }) cropCanvas: ElementRef<HTMLCanvasElement>; // Tham chiếu đến canvas dùng để crop ảnh

  // Input để nhận dữ liệu từ component cha
  @Input() imageSrc: string; // Đường dẫn hoặc base64 của ảnh cần crop

  // Output để phát sự kiện lên component cha
  @Output() cropped = new EventEmitter<string>(); // Phát sự kiện khi crop xong, kèm theo base64 của ảnh đã crop
  @Output() crop = new EventEmitter<string>(); // Phát sự kiện khi crop xong, kèm theo base64 của ảnh đã crop
  @Output() clear = new EventEmitter<void>(); // Phát sự kiện khi clear ảnh


  private image: HTMLImageElement; // Đối tượng Image để tải ảnh
  private ctx: CanvasRenderingContext2D | null; // Context của canvas hiển thị ảnh
  private cropCtx: CanvasRenderingContext2D | null; // Context của canvas crop ảnh
  // private isDragging = false; // Trạng thái kéo chuột để vẽ crop box
  // Vị trí khi bắt đầu kéo chuột
  // private startX = 0;
  // private startY = 0;
  // Vị trí x của crop box
  private cropX = 10;
  private cropY = 10;
  // kích thước của crop box
  private cropWidth = 600;
  private cropHeight = 600;
  // Khoảng cách từ vị trí chuột đến góc trên bên trái của crop box khi di chuyển
  private offsetX = 0;
  private offsetY = 0;

  private scale = 1; // Tỷ lệ scale của ảnh
  // kích thước của ảnh sau khi scale
  private imageWidth = 0;
  private imageHeight = 0;
  // kích thước ban đầu của ảnh
  private initialImageWidth = 0;
  private initialImageHeight = 0;
  private isResizing = false; // Trạng thái resize crop box
  private resizeDirection: 'nw' | 'ne' | 'sw' | 'se' | null = null; // Hướng resize crop box
  private resizeStartX = 0; // Vị trí x khi bắt đầu resize
  private resizeStartY = 0; // Vị trí y khi bắt đầu resize
  private isMoving = false; // Trạng thái di chuyển crop box
  private maxCanvasWidth = 100; // Chiều rộng tối đa của canvas
  private maxCanvasHeight = 100; // Chiều cao tối đa của canvas
  private imageX = 0; // Vị trí x của ảnh trên canvas
  private imageY = 0; // Vị trí y của ảnh trên canvas

  // Hàm lifecycle hook, được gọi sau khi view đã được khởi tạo
  ngAfterViewInit(): void {
    // Lấy context của canvas
    this.ctx = this.imageCanvas.nativeElement.getContext('2d');
    this.cropCtx = this.cropCanvas.nativeElement.getContext('2d');

    // Tạo đối tượng Image để tải ảnh
    this.image = new Image();
    this.image.onload = () => {
      // Lưu lại kích thước ban đầu của ảnh
      this.initialImageWidth = this.image.width;
      this.initialImageHeight = this.image.height;

      // Tính toán kích thước tối đa cho canvas dựa trên kích thước của phần tử cha
      this.maxCanvasWidth = this.imageCanvas.nativeElement.parentElement?.clientWidth || 100;
      this.maxCanvasHeight = this.imageCanvas.nativeElement.parentElement?.clientHeight || 100;

      // Tính toán tỷ lệ scale để ảnh vừa với canvas
      const widthScale = this.maxCanvasWidth / this.initialImageWidth;
      const heightScale = this.maxCanvasHeight / this.initialImageHeight;
      this.scale = Math.min(widthScale, heightScale, 1); // Giới hạn scale không vượt quá 1

      // Tính toán kích thước của ảnh sau khi scale
      this.imageWidth = this.initialImageWidth * this.scale;
      this.imageHeight = this.initialImageHeight * this.scale;

      // Tính toán vị trí để ảnh nằm giữa canvas
      this.imageX = (this.maxCanvasWidth - this.imageWidth) / 2;
      this.imageY = (this.maxCanvasHeight - this.imageHeight) / 2;

      // Điều chỉnh kích thước crop box ban đầu
      // const initialSize = Math.min(this.imageWidth * 1.3, this.imageHeight * 1.3, 300);
      // this.cropWidth = initialSize;
      // this.cropHeight = initialSize;
      this.cropWidth = this.imageWidth;
      this.cropHeight = this.imageHeight;
      this.cropX = (this.imageWidth - this.cropWidth) / 2 + this.imageX;
      this.cropY = (this.imageHeight - this.cropHeight) / 2 + this.imageY;

      // Vẽ canvas
      this.drawCanvas();
    };
    // Gán đường dẫn ảnh cho đối tượng Image để bắt đầu tải ảnh
    this.image.src = this.imageSrc;
  }

  // Hàm vẽ canvas
  private drawCanvas() {
    if (!this.ctx) return; // Nếu không có context thì không vẽ
    // Thiết lập kích thước canvas
    this.imageCanvas.nativeElement.width = this.maxCanvasWidth;
    this.imageCanvas.nativeElement.height = this.maxCanvasHeight;
    // Xóa canvas
    this.ctx.clearRect(0, 0, this.maxCanvasWidth, this.maxCanvasHeight);
    // Vẽ ảnh lên canvas
    this.ctx.drawImage(this.image, this.imageX, this.imageY, this.imageWidth, this.imageHeight);
    // Vẽ crop box
    this.drawCropBox();
  }

  // Hàm vẽ crop box
  private drawCropBox() {
    if (!this.ctx) return; // Nếu không có context thì không vẽ
    // Thiết lập màu và độ dày của đường viền crop box
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    // Vẽ hình chữ nhật crop box
    this.ctx.strokeRect(this.cropX, this.cropY, this.cropWidth, this.cropHeight);
    this.ctx.setLineDash([]);
    // Làm xám vùng ngoài crop box
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.maxCanvasWidth, this.maxCanvasHeight);
    this.ctx.rect(this.cropX, this.cropY, this.cropWidth, this.cropHeight);
    this.ctx.closePath();
    this.ctx.fill('evenodd');
    // Vẽ các handle resize
    this.drawResizeHandles();
  }

  // Hàm vẽ các handle resize
  private drawResizeHandles() {
    if (!this.ctx) return; // Nếu không có context thì không vẽ
    const handleSize = 8; // Kích thước của handle
    this.ctx.fillStyle = 'white'; // Màu của handle

    // Vẽ handle ở góc trên bên trái
    this.ctx.fillRect(this.cropX - handleSize / 2, this.cropY - handleSize / 2, handleSize, handleSize);
    // Vẽ handle ở góc trên bên phải
    this.ctx.fillRect(this.cropX + this.cropWidth - handleSize / 2, this.cropY - handleSize / 2, handleSize, handleSize);
    // Vẽ handle ở góc dưới bên trái
    this.ctx.fillRect(this.cropX - handleSize / 2, this.cropY + this.cropHeight - handleSize / 2, handleSize, handleSize);
    // Vẽ handle ở góc dưới bên phải
    this.ctx.fillRect(this.cropX + this.cropWidth - handleSize / 2, this.cropY + this.cropHeight - handleSize / 2, handleSize, handleSize);
  }

  // Hàm xử lý sự kiện mousedown
  onMouseDown(event: MouseEvent) {
    const mouseX = event.offsetX; // Vị trí x của chuột
    const mouseY = event.offsetY; // Vị trí y của chuột

    // Kiểm tra xem chuột có nằm trên các handle resize không
    const handleSize = 8;
    if (mouseX >= (this.cropX - handleSize / 2) && mouseX <= (this.cropX + handleSize / 2) &&
      mouseY >= (this.cropY - handleSize / 2) && mouseY <= (this.cropY + handleSize / 2)) {
      this.isResizing = true; // Bật trạng thái resize
      this.resizeDirection = 'nw'; // Đặt hướng resize là nw (northwest)
      this.resizeStartX = mouseX; // Lưu vị trí x khi bắt đầu resize
      this.resizeStartY = mouseY; // Lưu vị trí y khi bắt đầu resize
      return;
    }
    if (mouseX >= ((this.cropX + this.cropWidth) - handleSize / 2) && mouseX <= ((this.cropX + this.cropWidth) + handleSize / 2) &&
      mouseY >= (this.cropY - handleSize / 2) && mouseY <= (this.cropY + handleSize / 2)) {
      this.isResizing = true; // Bật trạng thái resize
      this.resizeDirection = 'ne'; // Đặt hướng resize là ne (northeast)
      this.resizeStartX = mouseX; // Lưu vị trí x khi bắt đầu resize
      this.resizeStartY = mouseY; // Lưu vị trí y khi bắt đầu resize
      return;
    }
    if (mouseX >= (this.cropX - handleSize / 2) && mouseX <= (this.cropX + handleSize / 2) &&
      mouseY >= ((this.cropY + this.cropHeight) - handleSize / 2) && mouseY <= ((this.cropY + this.cropHeight) + handleSize / 2)) {
      this.isResizing = true; // Bật trạng thái resize
      this.resizeDirection = 'sw'; // Đặt hướng resize là sw (southwest)
      this.resizeStartX = mouseX; // Lưu vị trí x khi bắt đầu resize
      this.resizeStartY = mouseY; // Lưu vị trí y khi bắt đầu resize
      return;
    }
    if (mouseX >= ((this.cropX + this.cropWidth) - handleSize / 2) && mouseX <= ((this.cropX + this.cropWidth) + handleSize / 2) &&
      mouseY >= ((this.cropY + this.cropHeight) - handleSize / 2) && mouseY <= ((this.cropY + this.cropHeight) + handleSize / 2)) {
      this.isResizing = true; // Bật trạng thái resize
      this.resizeDirection = 'se'; // Đặt hướng resize là se (southeast)
      this.resizeStartX = mouseX; // Lưu vị trí x khi bắt đầu resize
      this.resizeStartY = mouseY; // Lưu vị trí y khi bắt đầu resize
      return;
    }

    // Kiểm tra xem chuột có nằm trong crop box không để di chuyển
    if (mouseX >= this.cropX && mouseX <= (this.cropX + this.cropWidth) &&
      mouseY >= this.cropY && mouseY <= (this.cropY + this.cropHeight)) {
      this.isMoving = true; // Bật trạng thái di chuyển
      this.offsetX = mouseX - this.cropX; // Lưu khoảng cách từ chuột đến góc trên bên trái của crop box
      this.offsetY = mouseY - this.cropY; // Lưu khoảng cách từ chuột đến góc trên bên trái của crop box
      return;
    }

    // // Nếu không nằm trên handle resize hoặc crop box thì bắt đầu kéo chuột để vẽ crop box
    // this.isDragging = true; // Bật trạng thái kéo chuột
    // this.startX = mouseX; // Lưu vị trí x khi bắt đầu kéo chuột
    // this.startY = mouseY; // Lưu vị trí y khi bắt đầu kéo chuột
  }

  // Hàm xử lý sự kiện mousemove
  onMouseMove(event: MouseEvent) {
    if (!this.ctx) return; // Nếu không có context thì không xử lý
    const mouseX = event.offsetX; // Vị trí x của chuột
    const mouseY = event.offsetY; // Vị trí y của chuột

    // Nếu đang resize thì gọi hàm resizeCropBox
    if (this.isResizing) {
      this.resizeCropBox(mouseX, mouseY);
      return;
    }

    // Nếu đang di chuyển thì gọi hàm moveCropBox
    if (this.isMoving) {
      this.moveCropBox(mouseX, mouseY);
      return;
    }

    // // Nếu không đang kéo chuột thì không xử lý
    // if (!this.isDragging) return;

    // // Tính toán vị trí và kích thước của crop box khi kéo chuột
    // this.cropX = Math.min(this.startX, mouseX);
    // this.cropY = Math.min(this.startY, mouseY);
    // this.cropWidth = Math.abs(mouseX - this.startX);
    // this.cropHeight = Math.abs(mouseY - this.startY);

    // // Vẽ lại canvas
    // this.drawCanvas();
  }

  // Hàm resize crop box
  private resizeCropBox(mouseX: number, mouseY: number) {
    if (!this.resizeDirection) return; // Nếu không có hướng resize thì không xử lý

    const deltaX = mouseX - this.resizeStartX; // Khoảng cách di chuyển chuột theo chiều x
    const deltaY = mouseY - this.resizeStartY; // Khoảng cách di chuyển chuột theo chiều y

    // Thay đổi vị trí và kích thước của crop box dựa trên hướng resize
    switch (this.resizeDirection) {
      case 'nw':
        this.cropX += deltaX;
        this.cropY += deltaY;
        this.cropWidth -= deltaX;
        this.cropHeight -= deltaY;
        break;
      case 'ne':
        this.cropY += deltaY;
        this.cropWidth += deltaX;
        this.cropHeight -= deltaY;
        break;
      case 'sw':
        this.cropX += deltaX;
        this.cropWidth -= deltaX;
        this.cropHeight += deltaY;
        break;
      case 'se':
        this.cropWidth += deltaX;
        this.cropHeight += deltaY;
        break;
    }

    // Lưu lại vị trí chuột khi resize
    this.resizeStartX = mouseX;
    this.resizeStartY = mouseY;

    // Giới hạn kích thước và vị trí của crop box
    this.cropWidth = Math.max(10, this.cropWidth);
    this.cropHeight = Math.max(10, this.cropHeight);
    // this.cropX = Math.max(this.imageX, this.cropX);
    // this.cropY = Math.max(this.imageY, this.cropY);
    // this.cropX = Math.min(this.imageX + this.imageWidth, this.cropX);
    // this.cropY = Math.min(this.imageY + this.imageHeight, this.cropY);
    this.cropWidth = Math.min(this.imageX + this.imageWidth - this.cropX, this.cropWidth);
    this.cropHeight = Math.min(this.imageY + this.imageHeight - this.cropY, this.cropHeight);

    // Vẽ lại canvas
    this.drawCanvas();
  }

  // Hàm di chuyển crop box
  private moveCropBox(mouseX: number, mouseY: number) {
    // Tính toán vị trí mới của crop box
    let newCropX = mouseX - this.offsetX;
    let newCropY = mouseY - this.offsetY;

    // Giới hạn vị trí của crop box
    newCropX = Math.max(this.imageX, newCropX); // Không cho cropX nhỏ hơn vị trí X của ảnh
    newCropY = Math.max(this.imageY, newCropY); // Không cho cropY nhỏ hơn vị trí Y của ảnh
    newCropX = Math.min(this.imageX + this.imageWidth - this.cropWidth, newCropX); // Không cho cropX + cropWidth lớn hơn vị trí X của ảnh + chiều rộng ảnh
    newCropY = Math.min(this.imageY + this.imageHeight - this.cropHeight, newCropY); // Không cho cropY + cropHeight lớn hơn vị trí Y của ảnh + chiều cao ảnh

    this.cropX = newCropX;
    this.cropY = newCropY;

    // Vẽ lại canvas
    this.drawCanvas();
  }

  // Hàm xử lý sự kiện mouseup
  onMouseUp() {
    // Tắt các trạng thái kéo chuột, resize và di chuyển
    // this.isDragging = false;
    this.isResizing = false;
    this.resizeDirection = null;
    this.isMoving = false;
  }

  // Hàm xử lý sự kiện mouseleave
  onMouseLeave() {
    // Tắt các trạng thái kéo chuột, resize và di chuyển
    // this.isDragging = false;
    this.isResizing = false;
    this.resizeDirection = null;
    this.isMoving = false;
  }

  // Hàm zoom ảnh
  zoom(event: any) {
    const zoomValue = parseFloat(event.target.value); // Lấy giá trị zoom từ input
    this.scale = zoomValue; // Cập nhật tỷ lệ scale
    // Tính toán lại kích thước của ảnh sau khi zoom
    this.imageWidth = this.initialImageWidth * this.scale;
    this.imageHeight = this.initialImageHeight * this.scale;
    // Tính toán lại vị trí của ảnh sau khi zoom
    this.imageX = (this.maxCanvasWidth - this.imageWidth) / 2;
    this.imageY = (this.maxCanvasHeight - this.imageHeight) / 2;
    // Tính toán lại vị trí của crop box sau khi zoom
    this.cropX = (this.imageWidth - this.cropWidth) / 2 + this.imageX;
    this.cropY = (this.imageHeight - this.cropHeight) / 2 + this.imageY;
    // Vẽ lại canvas
    this.drawCanvas();
  }

  // Hàm crop ảnh
  cropImage() {
    if (!this.cropCtx) return; // Nếu không có context thì không xử lý
    // Thiết lập kích thước canvas crop
    this.cropCanvas.nativeElement.width = this.cropWidth;
    this.cropCanvas.nativeElement.height = this.cropHeight;
    // Vẽ ảnh đã crop lên canvas crop
    this.cropCtx.drawImage(
      this.image,
      (this.cropX - this.imageX) / this.scale,
      (this.cropY - this.imageY) / this.scale,
      this.cropWidth / this.scale,
      this.cropHeight / this.scale,
      0,
      0,
      this.cropWidth,
      this.cropHeight
    );
    // Lấy base64 của ảnh đã crop
    const croppedImage = this.cropCanvas.nativeElement.toDataURL('image/png');
    // Phát sự kiện crop lên component cha
    this.crop.emit(croppedImage);
  }

  // Hàm clear ảnh
  cancel() {
    // Phát sự kiện clear lên component cha
    this.clear.emit();
  }
}
tinymce.init({
  selector: 'textarea.textarea-mce',
  license_key: 'gpl',
  plugins: "image",
  placeholder: "Nhập mô tả sản phẩm",
  height: 600,
  toolbar: "image",
  image_title: true,
  automatic_uploads: true,
  images_upload_url: '/admin/upload',
});


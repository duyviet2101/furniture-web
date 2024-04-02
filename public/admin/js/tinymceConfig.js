tinymce.init({
  selector: 'textarea.textarea-mce',
  license_key: 'gpl',
  plugins: "image",
  height: 600,
  toolbar: "image",
  image_title: true,
  automatic_uploads: true,
  images_upload_url: '/admin/upload',
});


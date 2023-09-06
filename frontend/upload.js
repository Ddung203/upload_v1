const image_input = document.querySelector("#image_input");
var uploaded_image = "";

image_input.addEventListener("change", async (e) => {
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    uploaded_image = reader.result;
    document.querySelector(
      "#display_image"
    ).style.backgroundImage = `url(${uploaded_image})`;
  });

  const selectedFile = image_input.files[0];
  if (selectedFile) {
    reader.readAsDataURL(selectedFile);
    console.log({ selectedFile });
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error("Lỗi khi tải lên:", response.message);
      }
    } catch (error) {
      console.error("Lỗi khi tải lên (catch):", error);
    }
  }
});

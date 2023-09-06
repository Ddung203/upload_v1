const btnRf = document.querySelector("#refresh");
const list = document.querySelector("#list_img");
let dataImg = [];

btnRf.addEventListener("click", async (e) => {
  try {
    const response = await fetch("http://localhost:3000/files", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);

      if (dataImg.length != data.length) {
        dataImg = data;
        listHandle(dataImg);
      }
    } else {
      console.error("Lỗi khi lấy dữ liệu:", response.message);
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu (catch):", error);
  }
});

const listHandle = (imagesArray) => {
  imagesArray.forEach((image) => {
    const liElement = document.createElement("li");
    const imgElement = document.createElement("img");
    const spanElement = document.createElement("span");

    imgElement.src = `../backend${image.url}`;
    imgElement.classList.add("list_item");
    spanElement.textContent = image.name;

    liElement.appendChild(imgElement);
    liElement.appendChild(spanElement);

    list.appendChild(liElement);
  });
};

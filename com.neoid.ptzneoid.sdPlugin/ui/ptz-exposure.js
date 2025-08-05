const select = document.querySelector("#MeuAemode");

const containerManual = document.querySelector("#container-manual");

  select.addEventListener("change", () => {
    if (select.value === "3") {
      containerManual.style.display = "block";
      
    } else {
      containerManual.style.display = "none";
    }
  });


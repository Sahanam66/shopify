if (!document.eventListenerAdded) {
  document.eventListenerAdded = true;

  document.addEventListener("DOMContentLoaded", async function () {
    try {
      const response = await fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448');
      const data = await response.json();
      const a = data.product;

      // Images
      const imagesArray = a.images;
      const firstImageContainer = document.querySelector('.first-image-container');
      const otherImagesContainer = document.querySelector('.other-images-container');
      let selectedImage = null;

      const firstImgElement = document.createElement('img');
      firstImgElement.src = imagesArray[0].src;
      firstImageContainer.appendChild(firstImgElement);

      function handleOtherImageClick(imageElement) {
        if (selectedImage) {
          selectedImage.classList.remove('selected-image');
        }

        imageElement.classList.add('selected-image');
        selectedImage = imageElement;

        const clickedSrc = imageElement.src;
        firstImgElement.src = clickedSrc;
      }

      imagesArray.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.addEventListener('click', function () {
          handleOtherImageClick(this);
        });

        imgElement.style.width = '80px';
        imgElement.style.height = '80px';

        if (index === 0) {
          imgElement.classList.add('selected-image');
          selectedImage = imgElement;
        }

        otherImagesContainer.appendChild(imgElement);
      });



      // Product Title and Vendor
      document.getElementById('title-container').textContent = a.vendor;
      document.getElementById('title').textContent = a.title;

      // Price
      document.getElementById('discountPrice').textContent = a.price + ".00";
      document.getElementById('originalPrice').textContent = a.compare_at_price + ".00";

      // Percentage off
      function convertPriceStringToNumber(priceString) {
        return parseFloat(priceString.replace('$', '').replace(',', ''));
      }
      let original = convertPriceStringToNumber(a.compare_at_price);
      let discount = convertPriceStringToNumber(a.price);
      let percentage = ((original - discount) / original) * 100;
      let p = parseInt(percentage);
      document.getElementById('sale').textContent = p + "% off";

      //choosing color
      const colorOptionsDiv = document.querySelector('.color-options');
      let selectedColor = null;
      const colorOption = a.options.find(option => option.name === 'Color');
      if (colorOption) {
        colorOption.values.forEach(color => {
          const colorName = Object.keys(color)[0];
          const colorCode = color[colorName];
          const colorDiv = document.createElement('div');
          colorDiv.classList.add('color-option');
          colorDiv.style.backgroundColor = colorCode;
          colorOptionsDiv.appendChild(colorDiv);
          colorDiv.addEventListener('click', function (event) {
            const highlightedDiv = document.querySelector('.color-option.highlighted');

            if (highlightedDiv) {
              highlightedDiv.classList.remove('highlighted');
              highlightedDiv.style.border = '';
              highlightedDiv.style.padding = '';
              const checkSymbol = highlightedDiv.querySelector('.check-symbol');
              if (checkSymbol) {
                checkSymbol.remove();
              }
            }


            colorDiv.classList.add('highlighted');
            selectedColor = colorName;
            console.log('Selected Color:', selectedColor);

            colorDiv.style.border = `2px solid ${colorCode}`;
            colorDiv.style.padding = '2px';

            const otherColorDivs = document.querySelectorAll('.color-option');
            otherColorDivs.forEach(div => {
              if (div !== colorDiv) {
                div.classList.remove('highlighted');
                div.style.border = '';
                div.style.padding = '';
                const checkSymbol = div.querySelector('.check-symbol');
                if (checkSymbol) {
                  checkSymbol.remove();
                }
              }
            });

            const checkSymbol = document.createElement('div');
            checkSymbol.classList.add('check-symbol');
            checkSymbol.innerHTML = '&#10003;';
            checkSymbol.style.color = 'white';
            colorDiv.appendChild(checkSymbol);


            event.stopPropagation();
          });

          document.body.addEventListener('click', function () {
            const highlightedDiv = document.querySelector('.color-option.highlighted');
            if (highlightedDiv) {
              highlightedDiv.classList.remove('highlighted');
              highlightedDiv.style.border = '';
              highlightedDiv.style.padding = '';
              const checkSymbol = highlightedDiv.querySelector('.check-symbol');
            }
          });

        });
      }

      // Sizes
      const sizeOptionsDiv = document.querySelector('.size-options');
      const sizeValues = a.options.find(option => option.name === "Size").values;

      sizeValues.forEach(size => {
        const container = document.createElement('div');
        container.classList.add('size-option');

        const radioBtn = document.createElement('input');
        radioBtn.type = 'radio';
        radioBtn.name = 'size-option';
        radioBtn.value = size;

        radioBtn.addEventListener('change', function () {
          selectedSize = this.value;
          console.log('Selected Size:', selectedSize);
        });

        const label = document.createElement('label');
        label.textContent = size;

        container.appendChild(radioBtn);
        container.appendChild(label);
        sizeOptionsDiv.appendChild(container);
      })

      //Add to cart
      let number = 1;
      function updateNumber() {
        document.getElementById('number').textContent = number;
      }
      document.getElementById('decrement').addEventListener('click', function () {
        if (number > 1) {
          number--;
          updateNumber();
        }
      });

      document.getElementById('increment').addEventListener('click', function () {
        number++;
        updateNumber();
      });

      //onclick of add to cart button
      function displayInfo() {
        const infoBox = document.createElement('div');
        infoBox.classList.add('info-box');


        infoBox.textContent = `${a.title} with Color ${selectedColor} and Size ${selectedSize} added to cart`;


        document.getElementById('message').appendChild(infoBox);

        setTimeout(() => {
          infoBox.remove();
        }, 4000);
      }

      document.getElementById('add-to-cart').addEventListener('click', function () {
        if (selectedSize && selectedColor) {
          displayInfo();
        } else {
          console.log('Please select color and size before adding to cart.');
        }
      });

      // Description 
      let description = a.description;
      let cleanedDescription = description.replace(/<p[^>]*>/g, '').replace(/<\/p>/g, '');
      document.getElementById('description').textContent = cleanedDescription;


    } catch (error) {
      console.error('Error', error);
    }
  });
}
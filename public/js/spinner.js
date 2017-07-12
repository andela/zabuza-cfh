       let angle = 0;
       let spinner;
       /**
        * @function
        *
        * @param {any} sign
        * @return {void}
        */
       const galleryspin = (sign) => {
         spinner = document.querySelector('#spinner');
         if (!sign) {
           angle -= 45;
         } else { angle += 45; }
         spinner.setAttribute('style', `-webkit-transform: rotateY(${angle}deg); -moz-transform: rotateY(${angle}deg); transform: rotateY(${angle}deg);`);
       };

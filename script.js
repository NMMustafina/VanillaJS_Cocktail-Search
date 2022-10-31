document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('preloader');
    let baseUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
    const input = document.getElementById('search-input');
    const btn = document.getElementById('search-btn');
    const mainBlock = document.querySelector('.main-block');

    const renderCocktail = (item) => {
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
        <h3>Ingredients:</h3>
        <ul class="ing-list"></ul>
        <h3>Instruction:</h3>
        <p>${item.instr}</p>
        `;
        const ingList = document.querySelector('.ing-list');
        item.res.forEach(r => {
            const li = document.createElement('li');
            const meas = r.meas ? ` (${r.meas})` : '';
            li.innerHTML = `
            <img src="${r.img}" alt="${r.ing}">
            <span><b>${r.ing}</b>${meas}</span>
            `;
            ingList.append(li);
        });
    };

    const renderDrinks = (drinksArr) => {
        mainBlock.innerHTML = '';
        const heading = document.createElement('div');
        heading.innerHTML = `
        <h3 class="text-center text-uppercase text-secondary subtitle py-5 m-0">Search results for
        <strong class="text-success">${input.value}</strong>
        </h3>
          `;
        mainBlock.prepend(heading);
        const cardsBlock = document.createElement('div');
        cardsBlock.className = 'cards-block row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 pb-5';
        mainBlock.append(cardsBlock);
        drinksArr.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col';
            col.innerHTML = `
            <div class="card h-100 text-center border-0 rounded-0" role="button">
            <img src="${item.img}" class="card-img-top border rounded-0" alt="${item.name}">
            <div class="card-body border border-top-0">
              <h5 class="card-title">${item.name}</h5>
            </div>
          </div>
          `;
            document.querySelector('.cards-block').append(col);
            col.addEventListener('click', event => {
                event.preventDefault();
                const modal = new bootstrap.Modal(document.querySelector('#modal'));
                modal.show();
                renderCocktail(item);
            });

        });
        loader.style.display = 'none';
    };

    const getDrinks = async () => {
        try {
            const drinksArr = [];
            const response = await fetch(baseUrl + input.value);
            const result = await response.json();
            if (!result.drinks) {
                throw new Error('Not found');
            }
            const results = result.drinks;
            results.forEach(result => {
                const cocktail = {};
                cocktail.name = result.strDrink;
                cocktail.img = result.strDrinkThumb;
                cocktail.instr = result.strInstructions;
                cocktail.res = [];

                for (let i = 1; i <= 15; i++) {
                    const keyIng = 'strIngredient' + i;
                    const keyMeas = 'strMeasure' + i;
                    const obj = {}
                    if (result[`${keyIng}`]) {
                        obj.ing = result[`${keyIng}`];
                        obj.img = `https://www.thecocktaildb.com/images/ingredients/${obj.ing}-Small.png`;
                    } else {
                        break;
                    }
                    if (result[`${keyMeas}`]) {
                        obj.meas = result[`${keyMeas}`];
                    }
                    cocktail.res.push(obj);
                }
                drinksArr.push(cocktail);
            });
            renderDrinks(drinksArr);

        } catch (e) {
            loader.style.display = 'none';
            mainBlock.innerHTML = '';
            alert(e);
        }
    };

    btn.addEventListener('click', async event => {
        event.preventDefault();
        if (input.value) {
            loader.style.display = 'block';
            await getDrinks();
        } else {
            alert('Введите текст');
        }
    });

});
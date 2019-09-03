document.addEventListener('change', function (e) {
    let price = document.querySelectorAll('.price');
    let total = document.querySelectorAll('.total');
    let employment = document.querySelectorAll('.employment');
    let count = document.querySelectorAll('.count');
    let field_total = document.querySelectorAll('.field_total');
    let all_total = document.querySelector('input[name=all_total]');

    //1st initial total
    let index0 = 0;

    //2nd initial total
    let index1 = 0;

    //initial value
    let ini_val = 0;

    for (let i = 0; i < 3; i++) {
        index0 += (ini_val = parseInt(price[i].value || 0) * parseInt(employment[i].value || 0));
        total[i].value = price[i].value == "" ? "" : ini_val;
        index1 += (ini_val = parseInt(price[i + 3].value || 0) * parseInt(count[i].value || 0));
        total[i + 3].value = price[i + 3].value == "" ? "" : ini_val;
    }
    field_total[0].value = index0;
    field_total[1].value = index1;

    let button = document.getElementById('button');
    button.addEventListener("click", function (e) {
        e.preventDefault();
        all_total.value = index0 + index1;
    });
});
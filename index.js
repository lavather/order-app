import {menuArray} from './data.js'

writeMenu()

const completeOrderBtn=document.getElementById("complete-order-btn")
const closeModalBtn=document.getElementById("close-modal-btn")
const completePayment=document.getElementById("complete-payment")
const inputName=document.getElementById("input-name")
const inputStreet=document.getElementById("input-street")
const inputPostcode=document.getElementById("input-postcode")
const inputInstructions=document.getElementById("input-instructions")
const inputCardname=document.getElementById("input-cardname")
const inputCardNumber=document.getElementById("input-card-number")
const inputCvv=document.getElementById("input-cvv")
const orderarray=[]
let renderedOrder=""

window.addEventListener("click", function (e){
    const targetedItem = e.target
    if(e.target===completeOrderBtn){
        openModalPayment()
    }
    else if(e.target===closeModalBtn){
        closeModalWindow()
    }
    else if(e.target===completePayment){
        checkInputs()

        const inputFields = [inputCardname, inputCardNumber, inputCvv, inputName, inputStreet, inputPostcode];
        const hasEmptyFields = inputFields.some(function (field) {
            return field.classList.contains("input-empty");
        });

        if (!hasEmptyFields) {
            document.getElementById("flex-content").classList.add("hidden")
            document.getElementById("payment-modal").classList.add("hidden")
            document.getElementById("display-order-box").classList.add("hidden")
            document.getElementById("total-sum").classList.add("hidden")
            document.getElementById("thank-you").classList.remove("hidden")
        }
    }
    else if(e.target.dataset.add){
        addFoodButton(e.target.dataset.add)
    }
    else if(e.target.dataset.remove){
        removeItemfromOrder(e.target.dataset.remove)
    }
})

window.addEventListener("input", function(event) {
    const inputField = event.target;
    if (inputField===inputCvv){
        checkDigits()
    }
    CheckEmptyInputFields(inputField);
});

function CheckEmptyInputFields(x) {
    if (!x.value) {
      x.classList.add("input-empty");
      x.placeholder = "This field cannot be empty";
    } else {
        if (x===!inputCvv){
            x.classList.remove("input-empty");
        }
    }
}

function checkInputs(){
    CheckEmptyInputFields(inputCardname)
    CheckEmptyInputFields(inputCardNumber)
    CheckEmptyInputFields(inputName)
    CheckEmptyInputFields(inputStreet)
    CheckEmptyInputFields(inputPostcode)
}

function checkDigits(){
    if (inputCvv.value.length > 3) {
        inputCvv.value = inputCvv.value.slice(0, 3)
    } 
    else if(inputCvv.value.length===3){
        inputCvv.classList.remove("input-empty")
    }
    else if (inputCvv.value.length < 3){
        inputCvv.classList.add("input-empty")
    }       
}

function openModalPayment(){
    document.getElementById("payment-modal").classList.toggle('hidden')
    toggleNoPointers()
}

function closeModalWindow(){
    toggleEmptyValueInput()
    toggleNoPointers()
    const paymentModal=document.getElementById("payment-modal").classList.toggle('hidden')
}

function toggleNoPointers(){
    document.getElementById("display-order-box").classList.toggle('no-pointer') 
    document.getElementById("flex-content").classList.toggle('no-pointer')
    document.getElementById("complete-order-btn").classList.toggle('no-pointer')
}

function toggleEmptyValueInput(){
    inputCardname.value=""
    inputCardNumber.value=""
    inputCvv.value=""
    inputName.value=""
    inputStreet.value=""
    inputPostcode.value=""
    inputInstructions.value=""
}

function writeMenu(){
    const flexContent=document.getElementById("flex-content")

    menuArray.forEach(function (x){
        flexContent.innerHTML+= 
        `
        <div class="menu-point">
            <span>${x.emoji}</span>
            <div class="flex-text">
                <h2>${x.name}</h2>
                <h3>${x.ingredients.join(', ')}</h3>
                <h2>${x.price}</h2>
            </div>
        <button class="add-button" id="${x.id}" data-add=${x.id}>+</button>
        </div>
        `   
    })
}

function addFoodButton(x){
    
    let buttonID=x
    
    const targetMenuItem=menuArray.filter(function(item){
        return item.id===parseInt(buttonID)
    })
    const alreadyAdded = orderarray.some(function(item) {
        return item.id === targetMenuItem[0].id
      })

    if(!alreadyAdded){
        orderarray.push(targetMenuItem[0])
        const lastIndex = orderarray.length - 1;
        orderarray[lastIndex]["added"] = 1;
        
        renderOrder() 
    } 
    else if(alreadyAdded){
        targetMenuItem[0].added+=1;
        
        renderOrder()
    }

    const totalSum=document.getElementById("total-sum")
    if (totalSum.classList.contains("hidden")){
        document.getElementById("total-sum").classList.toggle('hidden')
        
    }
    const displayorderbox=document.getElementById("display-order-box")
    if (displayorderbox.classList.contains("hidden")){
        document.getElementById("display-order-box").classList.toggle('hidden')
        
    }
}

function renderOrder(){

    const displayOrderBox=document.getElementById("display-order-box")
    let partOrderDiv =""
    orderarray.forEach(function(item){
    partOrderDiv +=
        `
        <div class="order-input">
            <h2>${item.name}</h2>
            <h3 class="h3-added">${item.added}</h3>
            <button class="remove-button" data-remove=${item.id}>remove</button>
            <h2 class="h2-added">${item.price}€</h2>
        </div>
        `
    })

    renderedOrder= partOrderDiv

    displayOrderBox.innerHTML=`
        <div class="order-box">
         <h2 class="h2-center">Your Order</h2>
             ${partOrderDiv}
        </div>
     
       `
}

function removeItemfromOrder(x){
    const targetDeleteItem=orderarray.find(function(item){
        return item.id===parseInt(x)
    })
  
    if (targetDeleteItem.added > 1) {
        targetDeleteItem.added -= 1;
    } else {
        const index = orderarray.indexOf(targetDeleteItem);
        orderarray.splice(index, 1);
    }

    if(orderarray.length===0)
    {
        document.getElementById("total-sum").classList.toggle('hidden')
        document.getElementById("display-order-box").classList.toggle('hidden')
    }

    renderOrder();
    
}


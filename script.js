const form = document.getElementById('form')
const amount = document.getElementById('amount-input')
const desc = document.getElementById("Desc-input")
const category = document.getElementById("category-input")
const submitButton = document.getElementsByClassName("submitbtn")
const rightGreaterDiv = document.querySelector(".right-section-item-container")


document.addEventListener('DOMContentLoaded', async ()=>{
    try {
       await axios.get('https://crudcrud.com/api/8a5deb052bc94baeb9764e60efb9cf5b/expenses')
        .then((response)=>{
            for(let i=0; i<response.data.length; i++){
                //creating elements from database
                createElements(response.data[i])
            }
        })
        
    } catch (error) {
        console.log(error); 
    }
})

const errorMsg = document.createElement('h4')
errorMsg.classList.add('blank-form-error-text')
form.appendChild(errorMsg)
errorMsg.innerHTML = ''

submitButton[0].addEventListener('click',submit)

async function submit(e){
    e.preventDefault()

    if(amount.value=='' || desc.value=='' || category.value=="Select--"){
        form.style.backgroundColor = '#DB4437'
        errorMsg.innerHTML = 'Fill the form Properly'
        
    }else{
        errorMsg.innerHTML = ''
        form.style.backgroundColor=""

        // creating an object using values submitted
        subObj = {
            amt: amount.value,
            desc: desc.value,
            cat: category.value
        }

        // clearing the input fields
        amount.value='',
        desc.value=''
        category.value=''

        // sending to local storage

        try {
            await axios.post('https://crudcrud.com/api/8a5deb052bc94baeb9764e60efb9cf5b/expenses',subObj)
            .then((response)=>{
                console.log(response);
            })
            
        } catch (error) {
            console.log(err);
            
        }
        // calling create element to create elements from form data submitted
        createElements(subObj)
    }
}

// function which creates elements
function createElements(anyObject){
    // check data in frontend to delete already present data
    const duplicateCheckArray = document.getElementsByTagName("h3")
    for(let i=0; i<duplicateCheckArray.length; i++){
        if (duplicateCheckArray[i].firstChild.data == anyObject.desc){
            duplicateCheckArray[i].parentElement.remove()
        }
    }
    

    const singleItemContainer = document.createElement('div')
    const itemDeleteButton = document.createElement('div')
    const singleItemDeleteBtn = document.createElement('button')
    const amountEditContainer = document.createElement('div')
    const amountContainer = document.createElement('h2')
    const editButton = document.createElement('button')
    const descResult = document.createElement('h3')
    const categoryResult = document.createElement('div')

    // defining class of all the elements created
    singleItemContainer.classList.add('single-items-container')
    itemDeleteButton.classList.add('item-delete-button')
    singleItemDeleteBtn.classList.add('single-item-delete-btn')
    amountEditContainer.classList.add('amount-edit-container')
    amountContainer.classList.add('amount-result')
    editButton.classList.add('edit-button')
    descResult.classList.add('desc-result')
    categoryResult.classList.add('category-result')


    // appending children to their respective divs
    rightGreaterDiv.appendChild(singleItemContainer)
    singleItemContainer.appendChild(itemDeleteButton)
    itemDeleteButton.appendChild(singleItemDeleteBtn)
    singleItemContainer.appendChild(amountEditContainer)
    amountEditContainer.appendChild(amountContainer)
    amountEditContainer.appendChild(editButton)
    singleItemContainer.appendChild(descResult)
    singleItemContainer.appendChild(categoryResult)


    // Assigning values from the object we get in this function
    amountContainer.innerHTML= anyObject.amt
    descResult.innerHTML = anyObject.desc
    categoryResult.innerHTML = anyObject.cat




    // delete and edit funcationality ==================================================================================

    // delete-------------------------------
    singleItemDeleteBtn.addEventListener('click', deleteFn) 
    
    async function deleteFn(){
        
        //delete from database storage
        const targetElementText = singleItemDeleteBtn.parentElement.nextSibling.nextSibling.innerHTML
        console.log(targetElementText);

        try {
            await axios.get('https://crudcrud.com/api/8a5deb052bc94baeb9764e60efb9cf5b/expenses')
            .then((response) =>{
                for(let j=0; j<response.data.length; j++){
                    if(response.data[j].desc == targetElementText){
                    let targetElementIdToRemove = response.data[j]._id
                    try {
                        axios.delete(`https://crudcrud.com/api/8a5deb052bc94baeb9764e60efb9cf5b/expenses/${targetElementIdToRemove}`)
                        // .then((response) => {
                        //     console.log('deleted from database');
                        // })
                        
                    } catch (error) {
                        console.log(error);
                    }
                }}
            }) 
        } catch (error) {
            console.log(error);
        }

        singleItemDeleteBtn.parentElement.parentElement.remove()

    }

    // edit---------------------------------
    editButton.addEventListener('click', () =>{
        // populating values in form after click of editbtn
        amount.value = editButton.previousSibling.innerHTML
        desc.value = editButton.parentElement.nextSibling.innerHTML
        category.value = editButton.parentElement.nextSibling.nextSibling.innerHTML
        deleteFn()
    })
}

// search function
const searchBox = document.getElementById('search-input-box')

searchBox.addEventListener('keyup', function(e){
    let text = e.target.value
    console.log(text.toLowerCase());
    let allElements = document.getElementsByClassName('desc-result')
    let findingText = Array.from(allElements)
    findingText.forEach((ele) =>{
        console.log(ele.textContent);
        if(ele.textContent.toLocaleLowerCase().indexOf(text) != -1){
            ele.parentElement.style.display = 'block'
        }else{
            ele.parentElement.style.display = 'none'
        }
    })

})

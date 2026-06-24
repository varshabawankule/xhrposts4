const cl= console.log;

const postContainer = document.getElementById('postContainer')
const formpostID = document.getElementById('formpostID')


const titleControl = document.getElementById('title')
const bodyControl = document.getElementById('body')
const userIdControl = document.getElementById('userId')
const addPostbtn = document.getElementById('addPostbtn')
const updatePostbtn = document.getElementById('updatePostbtn')
const spinner = document.getElementById('spinner')






let BASE_URL = `https://jsonplaceholder.typicode.com`
let POST_URL = `${BASE_URL}/posts`

function tooltip(){
    $(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

}



function snackBar(msg, icon){
    Swal.fire({
        title : msg,
        icon : icon,
        timer : 3000 
    })
}

function createcards(arr){
    let result='';
    
    arr.forEach(post => {

result += `
   <div class="col-md-3 mb-3" id="${post.id}">

        <div class="card h-100">
            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${post.title}">
 
                <h3>
                    ${post.title}
                </h3>
            </div>
            <div class="card-body">
                <p> ${post.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button onClick= "onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                <button onClick= "onRemove(this)" class="btn btn-sm btn-danger">Remove</button>

            </div>
        </div>
    </div>

`

    })
postContainer.innerHTML= result
tooltip()
}


function fetchPost(){

    spinner.classList.remove('d-none')
let xhr= new XMLHttpRequest()
xhr.open('GET', POST_URL, true)
xhr.send(null)
xhr.onload=function(){
    if(xhr.status >= 200 && xhr.status <= 299){
        let postArr= JSON.parse(xhr.response)
        createcards(postArr)
        spinner.classList.add('d-none')

    }else{
        snackBar(`something went wrong while fetching data`, `error`)
spinner.classList.add('d-none')
    }
}


}
fetchPost()


function onPostSubmit(eve){
    eve.preventDefault()

    let Obj={
        title: titleControl.value ,
        body: bodyControl.value ,
        userId: userIdControl.value ,

    }
    cl(Obj)

spinner.classList.remove('d-none')

    let xhr= new XMLHttpRequest()
    xhr.open('POST', POST_URL)
    xhr.send(JSON.stringify(Obj))
    xhr.onload = function(){
        if(xhr.status >= 200  && xhr.status <= 299){
            let res= JSON.parse(xhr.response)

            let col= document.createElement('div');
            col.className= 'col-md-3 mb-3';
            col.id= res.id;
            col.innerHTML= `
              <div class="card h-100">
            <div class="card-header" data-toggle="tooltip" data-placement="top" title="${Obj.title}">
 
                <h3>
                    ${Obj.title}
                </h3>
            </div>
            <div class="card-body">
                <p> ${Obj.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
                <button onClick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                <button onClick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button>

            </div>
        </div>
            
            `
            postContainer.prepend(col)
            formpostID.reset()

            tooltip()


spinner.classList.add('d-none')
        }else{


spinner.classList.add('d-none')

        }
    }
}

function onEdit(ele){
    let EDIT_ID = ele.closest('.col-md-3').id
    cl(EDIT_ID)
localStorage.setItem('EDIT_ID', EDIT_ID)
let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`

spinner.classList.remove('d-none')

let xhr = new XMLHttpRequest()
xhr.open('GET', EDIT_URL)
xhr.send(null)
xhr.onload=  function(){
    if(xhr.status >= 200 && xhr.status<= 299){
        let EDIT_OBJ =JSON.parse(xhr.response)

titleControl.value= EDIT_OBJ.title,
bodyControl.value = EDIT_OBJ.body,
userIdControl.value = EDIT_OBJ.userId

addPostbtn.classList.add('d-none')
updatePostbtn.classList.remove('d-none')

formpostID.scrollIntoView({
    behavior: "smooth",
    block: 'start'
})

spinner.classList.add('d-none')

    }else{

  spinner.classList.add('d-none')      

    }
}


}

function onUpdate(){
    let UPDATE_ID = localStorage.getItem('EDIT_ID')


    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`

    let UPDATED_OBJ={
        
        title: titleControl.value ,
        body: bodyControl.value,
        userId: userIdControl.value ,

    }


spinner.classList.remove('d-none')
    let xhr= new XMLHttpRequest()
    xhr.open('PATCH',UPDATE_URL)
    xhr.send(JSON.stringify(UPDATED_OBJ))
    xhr.onload= function(){
        if(xhr.status >= 200 && xhr.status <= 299){

            let res= JSON.parse(xhr.response)

            let col= document.getElementById(UPDATE_ID)
            let h3= col.querySelector('.card-header h3')
            let p = col.querySelector('.card-body p')

            h3.innerText = UPDATED_OBJ.title,
            p.innerText = UPDATED_OBJ.body 

            formpostID.reset()

            addPostbtn.classList.remove('d-none')
            updatePostbtn.classList.add('d-none')

            col.scrollIntoView({
    behavior: "smooth",
    block: 'center'
})

spinner.classList.add('d-none')

snackBar(`The Post Object with id ${UPDATE_ID} is updated successfully`, `success`)

col.classList.add('highlight-card');

setTimeout(() => {
    col.classList.remove('highlight-card');
}, 4000);



        }else{
spinner.classList.add('d-none')

            snackBar(`something went while updating post`, `error`)


        }
    }
}

function onRemove(ele){

Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
   

let REMOVE_ID = ele.closest('.col-md-3').id
let REMOVE_URL= `${BASE_URL}/posts/${REMOVE_ID}`

let xhr= new XMLHttpRequest()
xhr.open('DELETE', REMOVE_URL)
xhr.send()
xhr.onload= function(){
    if(xhr.status >= 200 && xhr.status <= 299){
      ele.closest('.col-md-3').remove()


    }else{
        snackBar(`something went wrong`, `error`)
    }
}

}
});











}


formpostID.addEventListener("submit", onPostSubmit)
updatePostbtn.addEventListener('click', onUpdate)
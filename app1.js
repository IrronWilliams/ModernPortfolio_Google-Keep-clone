class App {
  constructor() {
    this.notes = []  //creating empty array. reference will allow for new notes from addNote() method to be added to array
    this.title = ''  //storing values of title from selectNote() method
    this.text = ''   //storing values of text from selectNote() method
    this.id = ''     //storing values of note id from selectNote() method
    
    /*reaching into DOM and creating references to html & css. since references have been created, they can be used in the
    class methods. the leading '$' tells javascript working with an HTML element as opposed to data. */
    this.$placeholder = document.querySelector("#placeholder") //used in displayNotes()
    this.$form = document.querySelector("#form") 
    this.$notes = document.querySelector("#notes")            //used in displayNotes()
    this.$noteTitle = document.querySelector("#note-title") 
    this.$noteText = document.querySelector("#note-text") 
    this.$formButtons = document.querySelector("#form-buttons") 
    this.$formCloseButton = document.querySelector("#form-close-button") 
    this.$modal = document.querySelector(".modal")                  //selecting special class modal from css file
    this.$modalTitle = document.querySelector(".modal-title")       //selecting special class modal-title from css file
    this.$modalText = document.querySelector(".modal-text")         //selecting special class modal-text from css file
    this.$modalCloseButton = document.querySelector('.modal-close-button') 
    this.$colorTooltip = document.querySelector('#color-tooltip')

    this.addEventListeners() //ensures method runs when app starts. 
  }

   /*the addEventListeners() method adds event listeners to each element in order to register different events.
    adding an event listener on the body. listening for a click event. click event will return data. passing in a string
    argument 'event' and a callback function that determines what should happen when event occurs. 
    1st event is to address what to do when the form is clicked. the steps can be managed with another method (handleFormClick).*/  
  addEventListeners() {
    document.body.addEventListener("click", event => {
      this.handleFormClick(event) 
      this.selectNote(event) 
      this.openModal(event) 
    }) 

    /*goal is to provide user with option to hover over the pallet icon which displays a tooltip, where user can select a color for 
    the note. to accomplish this need to use a mouse event. take the document body and add the mouseover event. pass event to a new
    function openTooltip() which will receive the event.  */
    document.body.addEventListener('mouseover', event => {
      this.openTooltip(event)
    })

    /*listen for a submit event on the form by referencing $this.form. listen for submit button or hitting enter key.
        
    forms have a default behavior which is when user clicks submit, or when there is a submit event, there is a default full page 
    reload. during refresh, form sends off data as if it were making a server request. to prevent the default behavior, use the 
    method on the event called preventDefault() and call it. this prevents a full page refresh/push-back to the server. 

    will get notes from note-title and note-text from html file. need to reach into the DOM, select both elements to get their value. 
    within constructor, create a reference to note-text (already have reference to note-title). create local variables to obtain their
    values:
      const title = this.$noteTitle.value 
      const text = this.$noteText.value. 
    
    when user clicks on app and creates a title and text, the values will be assigned to their respective local variables. will use 
    the OR operator to check if user actually entered either a title or text within the app. if there is a truthy value for title or 
    a truthy value for text (title || text), then can confirm there is an actual note and put the boolean value in a variable hasNote.
    can now use hasNote to conditionally add a note or not to the app. create another method addNote() to manage steps when title/text
    are added to app. 

    want to call and provide addNote() with values title and text. instead of creating separate parameters  addNote(title, text), 
    put value together on a single argument within an object. because of object, title and text can be passed by whatever order. making
    use of object short-hand. the short hand is comparable to where title property is set to value title and text property set to 
    text title: this.addNote({ title: title, text: text }). */

    this.$form.addEventListener("submit", event => {
      event.preventDefault()              //preventing default behavior of full page reload/push-back to server
      const title = this.$noteTitle.value //using this.$noteTitle reference to get note value from when user enters title in app
      const text = this.$noteText.value //using this.$noteText reference to get text value from when user enters text in app
      const hasNote = title || text   //checking if title OR text has truthy values. if truthy put in variable hasNote
      if (hasNote) {
        // add note
        this.addNote({ title, text })  //if hasNote true, then call addNote(). pass addNote with a single value, an object
      }
    }) 

    /*making close button functional. created reference to button in constructor. listening for a click event and close app
         
    the app will not close with just this statement -> this.closeForm()
    this.closeForm() is bubbling up and making the click event run into the click event handler for the body in adEventListeners(). 
    the adEventListeners() method calls handleFormClick function. the logic/conditional within handleFormClick() keeps the app open 
    if form is clicked.
    
    to fix this bubbling up issue, need to use another method on the event object. the method is stopPropagation(). this will stop 
    the closeForm() event from propagating all the way up to the handler for the document body. this stops the bubbling up and allows
    the close button to work as expected, close the app. propagate means to pass along to offspring. */
    
    this.$formCloseButton.addEventListener("click", event => {
      event.stopPropagation() 
      this.closeForm() //the app will not close without stopPropagation() 
    }) 

    /*adding event listener for click event for close button on modal. */
    this.$modalCloseButton.addEventListener('click', event => {
      this.closeModal(event)   
    })
  }

  /*using a target to determine if user clicked on form or not. to determine if target from event is within the 
  form, dive into the DOM (in constructor) and search for the form element  using documents.querySelector(#form).
  
  once reference to this.$form (via constructor) has been established, can check to see if user 'clicked' within the form by 
  chaining on the contains() method. within contains method, pass in (event.target). this determines if the event contains the target, 
  which is the 'form' user clicked. contains will return true or false value. store results in a variable. open form if clicked. if 
  clicked outside of form, close form*/

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target) 

    //adding title, text, hasNote variables to use in conditional. goal is to save notes when user clicks outside of form (w/o submit button)
    const title = this.$noteTitle.value 
    const text = this.$noteText.value 
    const hasNote = title || text 

    if (isFormClicked) {
      this.openForm()        //if clicked within form, open form
    } else if (hasNote) {
      this.addNote({ title, text }) //if hasNote contains either title or text, pass in object with title, text. will add when user clicks outside of form
    } else {
      this.closeForm()      //if clicked outside of form, close form
    }
  }

  /*creating a method on class to open the form. within styles.css have a special class called 'form open'  which will toggle the change
  of appearance between when app opens and when app closes. also updating html to display the note title 
  (css file for these classes are marked display:none).
  
  within constructor, created a reference to the 'note title' and 'form-buttons' on the css file.    

  since now have access to tile and buttons, can make the note titles and buttons visible by setting the styles of 
  note-title and form-button to display on page (display=block).*/

  openForm() {
    this.$form.classList.add("form-open") //add class to form
    this.$noteTitle.style.display = "block" 
    this.$formButtons.style.display = "block" 
  }

  /* to close form when user clicks away, reverse back to form state. to begin, remove the class from the form.
  then set display properties to none to hide the note titles and form buttons.*/
  closeForm() {
    this.$form.classList.remove("form-open") //remove class from form
    this.$noteTitle.style.display = "none" 
    this.$formButtons.style.display = "none" 
    this.$noteTitle.value = ""  //since getting value that was typed into property, can explicity mutate value to an empty string to clear the value 
    this.$noteText.value = "" 
  }
  
  /*creating openModel() method. goal is to allow user to select a note and make changes. will make use of another method off of 
  event.target called closest, ie event.target.closest. want to find whether the targeted element with the click was closest to the note. 
  looking at each of the notes being displayed in the displayNotes() method (<div style="background: ${note.color} " class="note">), 
  giving each note the class note. so if user clicks closest to the element with the class note, the the user is clicking on it. 
  
  if user clicks on note, want to open modal. the css file has a special class .open-modal, which makes the modal visible. by default, 
  the modal is not visible per the special class .modal; which has visibility hidden and opacity 0. want to change the class of the 
  element. to do this, need to get a reference to the modal via constructor. once reference established, take the classlist and use
  the toggle method on it and pass in the class open-modal. 

  when the modal is opened, want to have the modal populated with the appropriate title and text data. need to take the note the user
  clicked on and provide that data to the modal's input value properties. 1st step to accomplish this is to update the document body 
  click event handler (addEventListener) and add a reference to another function entitled selectNote().

  selectNote() method is now created and the data for title, text, id now in constructor, now have access to them. can now set the
  modals title and text inputs. 1st need to make reference to them via constructor. the modals value for title and text are set 
  to this.title and this.text respectively.*/

  openModal(event) {
     if (event.target.closest('.note')) {
        this.$modal.classList.toggle('open-modal')   
        this.$modalTitle.value = this.title 
        this.$modalText.value = this.text 
     }
  }
  
  /*closeModal() does 2 things; closes the modal and edits the appropriate to-do in the same process. method references a new function 
  editNote().  to close modal, do opposite of adding the open-modal class, so can reuse line from openModal(). function is now toggling to 
  where the open-modal class no longer exists. */
  closeModal(event) {
     this.editNote()  
     this.$modal.classList.toggle('open-modal') 
  }

  /*openTooltip() receives event from the mouseover event. only want to open tooltip when user hovers over the pallet. on the dynamic 
  html file created in displayNotes(), the pallet icon has a class of toolbar-color. so want to make sure if user is not hovering over
  toolbar-color, want to return from the function and don't do anything.  
    <img class="toolbar-color" src="https://icon.now.sh/palette">
  
  to accomplish this, use the matches() method from event.target.matches by making sure it matches the element class toolbar-color. 

  similar to the approach with selectNote() method, used the dataset attribute to get the id of the selected note. now user will be 
  hovering over the note. to get the hovering data, check the displayNotes() method to see what we have for each note. the approach 
  will be to add another data id to toolbar-color (easiest approach). or use the existing data-id on the note itself. can obtain this 
  value from the event by using a property nextElementSibling: event.target.nextElementSibling. this will return the note div itself.
  from this, can access the dataset property and from that the id.  this allows me to get the id again and put it in the constructor.
  
  but still need a little more info. need to know exactly where in the page the note is. regardless of how screen changes, say in width,
  want to make sure the tooltip is always above the pallet. to detect this, can use the event target to see where the user is hovering 
  over and use special property getBoundingClientRect(). this will provide specific info about the coordinates of where the user is 
  hovering over the note. can put this data in a new variable called notesCoords. to calculate this, need to know how much the user has 
  scrolled down the page. to determine where to put the tooltip, need to put the horizontal value by taking the noteCoords.left property
  and adding it to the scrollX position. scrollX will tell me how much the user has scrolled in the x (horizontal) direction. 
  to determine where to put the tooltip vertically, take the noteCoords.top property and add that to the scrollY position. scrollY tells 
  me how much the user has scrolled (vertically) in the y direction. now that i have a set of horizontal and vertical values, want to 
  use values as pixels for this.$colorTooltip with the style property: 
    this.$colorTooltip.style.transform   -> this will change the position of the tooltip to wherever the user hovers over, if they are
    actually hovering over the pallet via  if (!event.target.matches('.toolbar-color')). 
  
  will use translate to interpolate the values for horizontal pixels and vertical pixels: 
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`
  
  display tooltip by setting another style property display to flex:
    this.$colorTooltip.style.display = 'flex';

  need to update the html file by creating the tooltip and possible color options. add a div with id color-tooltip. this div will consist
  of 4 child divs. will have the class color-option and will include info on another data attribute called data-color. the 1st option 
  will be for the color white (hex code #fff) and give it id white. add 3 more divs for colors purple, orange and teal. these are the
  colors user will select form pallet. the styles for the colors are in css files. 

  need to create a reference to tooltip in constructor: this.$colorTooltip
  
    
  
  */
  openTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return //if user is not hovering over pallet do not do anything. 
    this.id = event.target.nextElementSibling.dataset.id   //accessing id from dataset property 
    const noteCoords = event.target.getBoundingClientRect() //provides info about the coordinates of where the user is hovering
    const horizontal = noteCoords.left + window.scrollX  // tell me how much the user has scrolled in the x (horizontal) direction
    const vertical = noteCoords.top + window.scrollY    //tell me how much the user has scrolled in the y (vertical) direction
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`//changes tooltip position to where user hovering and using translate to interpolate the values for horizontal/vertical pixels  
    this.$colorTooltip.style.display = 'flex'  //displaying tooltip




  }

  /*within addNote() function, just have a single parameter entitled 'note'. the note parameter receives its value from the object 
  created in the submit event listener. the best way to work with the note data from the app is an array, which will allow for much 
  flexibility to use different array methods. 1st step is to create an array in the constructor. 
  this array will start with an empty array for the notes. 

  when adding a new note, in addition to adding title and text, also want to add the fields id and color. the best way to organize this 
  info is with an object. the notes array created in the constructor will consist of a number of objects with all the data. 
  
  create a variable newNote set equal to an object with the data properties. the 'id' property can be used to check if there are any
  notes. can use a ternary to check if the length of the notes array >0. if >0, take length of array and add 1 on to it. this will 
  increment the last id by 1.  if length of notes >0 then take the entire array from this.notes, select the last item with 
  this.notes.length - 1, get the last item's id property and 1 to increment the id number.  
    id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1
  
  if there are no notes, can set the value of id to 1:
    id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
  
  now want to add the new note to the end or array by updating array immutably, preserving the previous array elements. want to 
  manually copy the previous notes array and add the new note to the end of array. this can be spreading this.notes to copy previous
  notes and put newNote to add to end of array. since now copied array and created a new one, [...this.notes, newNote], can now 
  directly mutate the notes array  this.notes = [...this.notes, newNote] */  

  /*  initial approach was to accept a single argument for addNote(). can apply destructuring  
  addNote(note) {     //receives an argument from the 'submit' event listener. argument is an object which contain results of title/text entered by user
    const newNote = {  //creating object to manage the notes data. assigning object to variable.  
      title: note.title,  //creating key/value pairs.  assigning key 'title' to value 'note.title' by using the argument passed into addNote()  
      text: note.text,
      color: 'white',
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1 //ternary to increment the id number by 1
    } 
    this.notes = [...this.notes, newNote]  //copying previous notes and adding new note to end of array. directly mutating notes array with = 
    //console.log(this.notes) //no longer logging notes. creating method displayNotes() to show notes on app   
    this.displayNotes()      //calling displayNotes method 
    this.closeForm()         //close form after adding notes  
  } */

  /*in handleFormClick() method, the note is provided as an object with properties title and text. can destructure note object and just get 
  the title and text properties. instead of using note.title and note.text, and because the key and values have same name, can use 
  object shorthand to create key/value pairs*/

  addNote({ title, text }) {  //receives argument from handleFormClick() method. destructuring object to get title/text properties. 
    const newNote = {         //creating object to manage the notes data. assigning object to variable.
      title,                  //using object shorthand to create key/value pairs for title and text.   
      text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1  //ternary to increment the id number by 1
    } 
    this.notes = [...this.notes, newNote] //copying previous notes and adding new note to end of array. directly mutating notes array with = 
    //console.log(this.notes) //no longer logging notes. creating method displayNotes() to show notes on app   
    this.displayNotes()   //calling displayNotes method 
    this.closeForm()    //close form after adding notes
  }
  
  /*editNote() does not need anything passed to it because all of the value that user will be updating are notes that are already
  in inputs this.$modalTitle.value and this.$modalText.value.  

  want this function to go accomplish following: 
    go to the notes array (in constructor this.notes)
    find the note with the stored id (in constructor this.id)
    take the updated title/text from modalTitle and modalText input (new data)
    update the note with the new data 
  
  need to iterate thru array of objects, then update the appropriate object. need to perform a transformation and want to keep the 
  array at the same length (not removing elements). map() will allow me to transform array and keep at same length. map() will iterate
  over each note. within the callback, want to see if note id is equal to the id stored in constructor (this.id). if equal, want to 
  conditionally update a given note for which the condition is true. create a new object where spreading in all previous properties, 
  that comes from note (current not iterating over), then grab the title and text values and update their respective properties. 
  otherwise return the note if user does not want to update it. 

  the id stored in constructor is stored as a string. this differs from the note id created in the addNote() method using the ternary
  (id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1). when a note is created the id is a number. 
  
  the note id in the constructor is a string because program is turning the note id into a string when putting it on the data-id 
  attribute via displayNotes() method: 
      <div style="background: ${note.color};" class="note" data-id="${note.id}">

  the different data types will cause an issue during comparison. can address this issue by converting this.id to a number or turn
  note.id to a string. better to compare numbers, although either approach works, so convert this is to a number. 

  now want to use the new array returned from map() to update the notes array in the constructor. after editing notes, want to 
  call method displayNotes() to display them. */

  editNote() {
     const title = this.$modalTitle.value 
     const text = this.$modalText.value 
     this.notes = this.notes.map(note => 
       note.id === Number(this.id) ? { ...note, title, text } : note
     ) 
     this.displayNotes() 
  }
  
  /*when the modal is opened, want to have the modal populated with the appropriate title and text data. need to take the note the user
  clicked and provide that data to the modal's input value properties. 1st step to accomplish this is to update the document body 
  click event handler (addEventListener) and add a reference to another function entitled selectNote()

  to get access to the data of the note user selected, can use 'closest' to figure out the selected note. this will return the 
  closest element to the note class. and putting the result in a variable will give me the selectedNote. 
    const $selectedNote = event.target.closest('.note')   -> returns a div with a class of 'note':     
    <div style="background: white "class="note">
  
  now need to find a way to reach into the note and grab the 2 values note.title and note.text. to accomplish this can take the 
  selected note we already have and grab its children. off of DOM elements, there is a property called children. that will give an 
  array of the elements within them. just want the 1st 2 children of the note div. this returns an HTML collection: 
    $selectedNote.children  -> returns an HTML collection. 

  based upon displayNotes(), the title will be the 1st element in array followed by text. can get the title and text by using the 
  property inner text. can take the array of children ($selectedNote.children) and apply array destructuring to get individual values
  from an array. declare the 2 elements that i want as variables within the square brackets [], (note.title followed by note.text)
  as the 1st and 2nd children. now can chain on innerText to get the values. 

  to make these value available to other parts of the app, can create instance properties in the constructor to store the values of 
  title and text. can now update properties this.title and this.text to be equal to the notes innerText.   

  looking ahead, will also need an additional property for the notes id. there is another way from getting data from the DOM outside 
  of innerText. to store an id in the html markup/templated html, can add a data property. data property is a way of storing data in 
  html. to create a value for each of the notes id, update the templated html in displayNotes() method with data-id.

  after the data-id attribute has been added to displayNotes(), which gives access to the note id itself, can now update 
  selectNote() accordingly:
    $selectedNote.dataset.id  -> there will be a property on the 'dataset' object that has the same name that followed the dash in
                                  the data property/attribute added in the div in the displayNotes() method. and that name was 'id' in
                                  'data-id'. so matching the properties called 'id' in selectNote() and displayNotes()
      */
  selectNote(event) {
     const $selectedNote = event.target.closest('.note') //using closest to figure out which note user clicked
     if (!$selectedNote) return //if a note not selected do not run following lines in function. w/o statement, program will try to get children when note hasn't been selected. error 'children null'  
     const [$noteTitle, $noteText] = $selectedNote.children //array destructuring to get individual values from array 
     this.title = $noteTitle.innerText //obtaining the text from title 
     this.text = $noteText.innerText 
     this.id = $selectedNote.dataset.id 
  }

  /*when displaying notes, want to hide the placeholder "Notes you add appear here". to hide placeholder, can apply similar 
  approach used with the closeForm() method. if there are notes, hide placeholder (set display to none). otherwise if there are no 
  notes, show the placeholder (set display to flex). 

  1st check the array to see if there are any notes and store in a variable -> const hasNotes = this.notes.length > 0. then conditionally
  check if there are any notes. update constructor with reference to placeholder. can now conditionally check if array has notes. if
  notes in array, do not display placeholder by updating the style.display to none. if no notes in array, display placeholder:

    if (hasNotes) {
      this.$placeholder.style.display = 'none'   
    } else {
      this.$placeholder.style.display = 'flex'     
    }
  
  this can be shortened via a ternary. if array has notes, return a string of 'none' else return a string of 'flex'. can conditionally 
  update placeholders display property as follows: 
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex'
  
  to display notes content, want to iterate over array using map() method. map is very useful for html templating. using map(), take each
  note and return the html that i need. for each note, want to have a div and on the div, want to take the color of each note, and 
  use an inline style to set the background of the note to white. have an inner div which contains the title. the inner div will  
  conditionally set a class  which can be done with the && operator. whereby if there is a title in the note, then use the class 
  'note-title'. create another div that holds the notes text ('note.text'). create another div that holds a toolbar which allows user 
  to delete/change color of note. to use the html/to display on page, output on notes container on the html file <div id="notes"></div>.
  
  to display the html, create a reference to the notes container in the constructor (with div with id of notes). then put all of the 
  templated data using map by associating  this.$notes.innerHTML = this.notes.map(note => 
  
  .join() - joins together all of the templated notes into a single string. w/o join() each note will be followed by a comma. 
  the comma is the result of working with an array via map method. 

  due to addtl functionality via the selectNote() method adding a data property to store the note id via data-id. now have an attribute
  where you can put the note.id on it. updated from/to:
    <div style="background: ${note.color} " class="note">
    <div style="background: ${note.color} " class="note data-id="${note.id}">
  
  since now getting access to the note id, can update selectNote() method with this info. */
  displayNotes() { 
    const hasNotes = this.notes.length > 0  //checking if there are elements in array
    this.$placeholder.style.display = hasNotes ? "none" : "flex" //updating the placeholders display property

     /*using map iterate over array and take the html that i need.  */
    this.$notes.innerHTML = this.notes
      .map(
        note => `
        <div style="background: ${note.color} " class="note" data-id="${note.id}">
          <div class="${note.title && "note-title"}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
     `
      )
      .join("") //joins the templated notes and removes the commas after each title/text entry
  }
}

new App() 

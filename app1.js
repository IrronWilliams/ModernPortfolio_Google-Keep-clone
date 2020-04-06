    /*creating reference to html file (id="form") and css file (classes note-title and form-button)
    the leading '$' tells javascript working with an HTML element as opposed to data. these statements are 
    creating references to html and css files.  since references have been created, they can be used in the
    class methods. */
class App {
    constructor() {
      this.notes = []   //creating empty array. reference will allow for new notes from addNote() method to be added to array
      
      //reaching into DOM and creating references to html. references used in methods 
      this.$placeholder = document.querySelector('#placeholder')  //used in displayNotes()
      this.$form = document.querySelector("#form") 
      this.$notes = document.querySelector('#notes')              //used in displayNotes()
      this.$noteTitle = document.querySelector("#note-title") 
      this.$noteText = document.querySelector("#note-text") 
      this.$formButtons = document.querySelector("#form-buttons") 
  
      this.addEventListeners()   //ensures method runs when app starts. 
    }
    /*the addEventListeners() method adds event listeners to each element in order to register different events.
    adding an event listener on the body. listening for a click event. click event will return data. passing in a string
    argument 'event' and a callback function that determines what should happen when event occurs. 
    1st event is to address what to do when the form is clicked. the steps can be managed with another method (handleFormClick).*/  
    addEventListeners() {
      document.body.addEventListener("click", event => {
        this.handleFormClick(event) 
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
      this.$form.addEventListener('submit', event => {
        event.preventDefault()                  //preventing default behavior of full page reload/push-back to server
        const title = this.$noteTitle.value     //using this.$noteTitle reference to get note value from when user enters title in app
        const text = this.$noteText.value       //using this.$noteText reference to get text value from when user enters text in app
        const hasNote = title || text           //checking if title OR text has truthy values. if truthy put in variable hasNote
        if (hasNote) {
          // add note  
          this.addNote({ title, text })        //if hasNote true, then call addNote(). pass addNote with a single value, an object
        }
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
  
      if (isFormClicked) {
        this.openForm()       //if clicked within form, open form
      } else {
        this.closeForm()     //if clicked outside of form, close form
      }
    }
  
    /*creating a method on class to open the form. within styles.css have a special class called 'form open'  which will toggle the change
    of appearance between when app opens and when app closes. also updating html to display the note title 
    (css file for these classes are marked display:none).
    
    within constructor, created a reference to the 'note title' and 'form-buttons' on the css file.    

    since now have access to tile and buttons, can make the note titles and buttons visible by setting the styles of 
    note-title and form-button to display on page (display=block).*/
    openForm() {
      this.$form.classList.add("form-open")   //add class to form
      this.$noteTitle.style.display = "block" 
      this.$formButtons.style.display = "block" 
    }

    /* to close form when user clicks away, reverse back to form state. to begin, remove the class from the form.
    then set display properties to none to hide the note titles and form buttons.*/
    closeForm() {
      this.$form.classList.remove("form-open")   //remove class from form
      this.$noteTitle.style.display = "none" 
      this.$formButtons.style.display = "none" 
      this.$noteTitle.value = '' //since getting value that was typed into property, can explicity mutate value to an empty string to clear the value 
      this.$noteText.value = '' 
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
    */
    displayNotes() {
      const hasNotes = this.notes.length > 0     //checking if there are elements in array
     this.$placeholder.style.display = hasNotes ? 'none' : 'flex'  //updating the placeholders display property
     
     /*using map iterate over array and take the html that i need.  */
     this.$notes.innerHTML = this.notes.map(note => `  
        <div style="background: ${note.color} " class="note">
          <div class="${note.title && 'note-title'}">${note.title}</div> 
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
     `).join("") //joins the templated notes and removes the commas after each title/text entry
      

    }
  
  
  
  }
  
  new App() 
  
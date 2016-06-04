/**
 * Created by Elf on 04.06.2016.
 */
var Note = React.createClass({
    render: function () {
        var style = {
            backgroundColor: this.props.color
        }
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}>x</span>
                {this.props.children}
            </div>
        );
    }
});

var ColorPicker = React.createClass({
    render: function(){
        return (
           <div className="color-picker">
               <div className="ellipse red" onClick={this.props.onChooseColor}></div>
               <div className="ellipse blue" onClick={this.props.onChooseColor}></div>
               <div className="ellipse lawngreen" onClick={this.props.onChooseColor}></div>
               <div className="ellipse coral" onClick={this.props.onChooseColor}></div>
               <div className="ellipse orange" onClick={this.props.onChooseColor}></div>
               <div className="ellipse deeppink" onClick={this.props.onChooseColor}></div>
               <div className="ellipse dodgerblue" onClick={this.props.onChooseColor}></div>
               <div className="ellipse yellow" onClick={this.props.onChooseColor}></div>
           </div>
       )
   }
});

var NoteEditor = React.createClass({
    getInitialState: function(){
        return {
            text: '',
            backColor: 'red'
        };
    },

    handleTextChange: function(event){
        this.setState({ text: event.target.value });
    },

    handleAddNote: function(){
        var newNote = {
            text: this.state.text,
            color: this.state.backColor,
            id: Date.now()
        }

        this.props.onNoteAdd(newNote);
        this.setState({
            text: '',
            backColor: 'red'
        });
    },

    handleChooseBackColor: function(event){
        //Get name color from class name
        var colorName = event.target.classList[1];

        //Set note back color
        this.setState({
             backColor: colorName
        })
    },

    render: function () {
        var style = {
            backgroundColor: this.state.backColor
        }
        return (
            <div className="note-editor">
                <textarea placeholder="Enter yout note here..."
                          rows={5}
                          style={style}
                          className="textarea"
                          value={this.state.text}
                          onChange={this.handleTextChange} ref="textArea"/>
                <ColorPicker onChooseColor={this.handleChooseBackColor} />
                <button className="add-button" onClick={this.handleAddNote}>Add Note</button>
            </div>
        );
    }
});

var NotesGrid = React.createClass({
    componentDidMount: function(){
         this.msnry = new Masonry( this.refs.grid, {
            itemSelector: '.note',
            columnWidht: 200,
            gutter: 10
        });
    },

    componentDidUpdate: function(prevProps){
        if(this.props.notes.length !== prevProps.notes.length){
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function () {
        var onNoteDelete = this.props.onNoteDelete;
        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function (note) {
                        return <Note key={note.id}
                                     color={note.color}
                                     onDelete={onNoteDelete.bind(null, note)}>{note.text}</Note>

                    })
                }
            </div>
        );
    }
});

var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes: []
        };
    },

    componentDidMount: function(){
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if(localNotes){
            this.setState({
                notes: localNotes
            });
        }
    },

    componentDidUpdate: function(){
        this._updateLocalStorage();
    },

    _updateLocalStorage: function(){
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    },

    handlerNoteDelete: function(note){
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note){
            return note.id !== noteId;
        });
        this.setState({notes: newNotes});
    },

    handlerNoteAdd: function(newNote){
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({ notes: newNotes });
    },

    render: function () {
        return (
            <div className="notes-app">
                <h1>Notes App</h1>
                <NoteEditor onNoteAdd={this.handlerNoteAdd} />
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handlerNoteDelete} />
            </div>
        );
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);
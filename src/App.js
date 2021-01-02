import React from 'react';
import './App.css';
import firebase from 'firebase';
import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedNoteIndex: null,
      selectedNote: null,
      notes: null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div>
          <SidebarComponent
            selectedNoteIndex={this.state.selectedNoteIndex}
            notes={this.state.notes}
            deleteNote={this.deleteNote}
            selectNote={this.selectNote}
            newNote={this.newNote}>
          </SidebarComponent>
        </div>
        {
          this.state.selectedNote ?
            <EditorComponent selectedNote={this.state.selectedNote}
              selectedNoteIndex={this.state.selectedNoteIndex}
              notes={this.state.notes}
              noteUpdate={this.noteUpdate}></EditorComponent> :
            null
        }
      </div>
    );
  }

  componentDidMount = () => {
    firebase
      .firestore()
      .collection('notes')
      .onSnapshot(serverUpdate => {
        const notes = serverUpdate.docs.map(_doc => {
          const data = _doc.data();
          data['id'] = _doc.id;
          return data;
        });
        this.setState({ notes: notes });
      });
  }

  selectNote = (note, index) => {
    this.setState({ selectedNoteIndex: index, selectedNote: note });
  }
  noteUpdate = (id, noteObj) => {
    firebase
      .firestore()
      .collection('notes')
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body,
        // setting timestamp for future history revisions
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
  }

  deleteNote = async (note) => {
    const noteIndex = this.state.notes.indexOf(note);
    this.setState({ notes: this.state.notes.filter(_note => _note !== note) });
    // if the note to be deleted is currently selected
    if (this.state.selectedNote === noteIndex) {
      this.setState({ selectedNote: null, selectedNoteIndex: null });
    } else {
      this.state.notes.length > 1 ?
        // update the index since the notes arr has been updated
        this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1) :
        // if we have no more notes
        this.setState({ selectedNote: null, selectedNoteIndex: null })
    }

    // delete from db 
    firebase.firestore().collection('notes').doc(note.id).delete();
  };

  // creating new note object from firestore 
  newNote = async (title) => {
    const note = {
      title: title,
      body: ''
    };

    const newFromDB = await firebase
      .firestore()
      .collection('notes')
      .add({
        title: note.title,
        body: note.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    const newID = newFromDB.id;
    await this.setState({
      // collect all the previous notes and add new note
      notes: [...this.state.notes, note]
    });
    // find the index of the newly created note and set it to current note
    const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(_note => _note.id === newID)[0]);
    this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex });
  }
}

export default App;

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
        console.log(notes);
        this.setState({ notes: notes });
      });
  }

  selectNote = (note, index) => {
    this.setState({ selectedNoteIndex: index, selectedNote: note });
  }
  noteUpdate = (id, noteObj) => {
    console.log(id, noteObj);
  }

  deleteNote = () => console.log('delete note');
  newNote = () => console.log('new note');
}

export default App;

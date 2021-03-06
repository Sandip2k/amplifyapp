import Amplify from "aws-amplify";
import awsconfig from "./aws-exports";
import { useState, useEffect } from "react";
import { AmplifySignOut, withAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import { listTodos } from "./graphql/queries";
import {
    createTodo as createNoteMutation,
    deleteTodo as deleteNoteMutation,
} from "./graphql/mutations";

Amplify.configure(awsconfig);

const initialFormState = { name: "", description: "" };

const App = () => {
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        const apiData = await API.graphql({ query: listTodos });
        setNotes(apiData.data.listTodos.items);
    }

    async function deleteNote({ id }) {
        const newNotesArray = notes.filter((note) => note.id !== id);
        setNotes(newNotesArray);
        await API.graphql({
            query: deleteNoteMutation,
            variables: { input: { id } },
        });
    }

    async function createNote() {
        if (!formData.name || !formData.description) return;
        await API.graphql({
            query: createNoteMutation,
            variables: { input: formData },
        });
        setNotes([...notes, formData]);
        setFormData(initialFormState);
    }

    return (
        <div className="App">
            <h1>My Notes App</h1>
            <input
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Note name"
                value={formData.name}
            />
            <input
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Note description"
                value={formData.description}
            />
            <button onClick={createNote}>Create Note</button>
            <div style={{ marginBottom: 30 }}>
                {notes.map((note) => (
                    <div key={note.id || note.name}>
                        <h2>{note.name}</h2>
                        <p>{note.description}</p>
                        <button onClick={() => deleteNote(note)}>
                            Delete note
                        </button>
                    </div>
                ))}
            </div>
            <AmplifySignOut />
        </div>
    );
};

export default withAuthenticator(App);

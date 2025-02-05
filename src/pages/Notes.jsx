import * as React from "react";
import Layout from "../components/Layout";

const Notes = () => {
    const ref = React.useRef(null);
    const isMounted = React.useRef(false);
    const titleRef = React.useRef(null);
    const [notes, setNotes] = React.useState([]);
    const [noteToDelete, setNoteToDelete] = React.useState(null);
    const [selectedNote, setSelectedNote] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState("");
    const updateTitleRef = React.useRef(null);
    const updateRef = React.useRef(null);
    const updateQuill = React.useRef(null);

    React.useEffect(() => {
        const loadQuill = () => {
            const script = document.createElement("script");
            const link = document.createElement("link");

            script.src = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
            link.rel = "stylesheet";

            script.onload = () => {
                if (!isMounted.current) {
                    new window.Quill(ref.current, {
                        theme: "snow",
                        modules: {
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'align': [] }],
                                ['bold', 'italic', 'underline'],
                                [{ 'color': [] }, { 'background': [] }],
                                ['link'],
                                [{ 'script': 'sub' }, { 'script': 'super' }]
                            ]
                        }
                    });
                    isMounted.current = true;
                }
            };

            document.head.append(script, link);

            return () => document.head.removeChild(script) && document.head.removeChild(link);
        };

        loadQuill();
    }, []);

    const filterNotes = (query) => {
        setSearchQuery(query);
    };

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openViewDialog = (note) => {
        setSelectedNote(note);
        document.getElementById('viewNotes').showModal();
    };

    React.useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
        setNotes(savedNotes);
    }, []);

    const resetInputs = () => {
        titleRef.current.value = '';
        if (ref.current) {
            ref.current.children[0].innerHTML = '';
        }
    };

    const createNote = (event) => {
        event.preventDefault();

        const title = titleRef.current.value;
        const desc = ref.current.children[0]?.innerHTML || '';
        const date = new Date().toLocaleString();
        const pin = false;
        const originalIndex = notes.length;

        const newNote = { title, desc, date, pin, originalIndex };

        const updatedNotes = [newNote, ...notes];

        updatedNotes.sort((a, b) => {
            if (a.pin === b.pin) {
                return b.originalIndex - a.originalIndex;
            }
            return b.pin - a.pin;
        });

        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setNotes(updatedNotes);

        document.getElementById("createNotes").close();
    };

    const togglePin = (index) => {
        const updatedNotes = [...notes];
        updatedNotes[index].pin = !updatedNotes[index].pin;

        updatedNotes.sort((a, b) => {
            if (a.pin === b.pin) {
                return b.originalIndex - a.originalIndex;
            }
            return b.pin - a.pin;
        });

        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
    };

    const deleteNote = () => {
        const updatedNotes = notes.filter((_, index) => index !== noteToDelete);
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setNotes(updatedNotes);
        document.getElementById("deleteNotes").close();
    };

    const openDeleteDialog = (index) => {
        setNoteToDelete(index);
        document.getElementById("deleteNotes").showModal();
    };

    const openUpdateDialog = (note) => {
        setSelectedNote(note);
        updateTitleRef.current.value = note.title;

        if (!window.Quill) {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js";
            script.onload = () => {
                if (!updateQuill.current) {
                    updateQuill.current = new window.Quill(updateRef.current, {
                        theme: "snow",
                        modules: {
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                [{ 'align': [] }],
                                ['bold', 'italic', 'underline'],
                                [{ 'color': [] }, { 'background': [] }],
                                ['link'],
                                [{ 'script': 'sub' }, { 'script': 'super' }]
                            ]
                        }
                    });
                }
                updateQuill.current.root.innerHTML = note.desc;
            };
            document.head.appendChild(script);

            const link = document.createElement("link");
            link.href = "https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css";
            link.rel = "stylesheet";
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(script);
                document.head.removeChild(link);
            };
        } else {
            if (!updateQuill.current) {
                updateQuill.current = new window.Quill(updateRef.current, {
                    theme: "snow",
                    modules: {
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'align': [] }],
                            ['bold', 'italic', 'underline'],
                            [{ 'color': [] }, { 'background': [] }],
                            ['link'],
                            [{ 'script': 'sub' }, { 'script': 'super' }]
                        ]
                    }
                });
            }
            updateQuill.current.root.innerHTML = note.desc;
        }

        document.getElementById('updateNotes').showModal();
    };

    const updateNote = (event) => {
        event.preventDefault();

        const updatedTitle = updateTitleRef.current.value;
        const updatedDesc = updateQuill.current?.root.innerHTML || '';
        const updatedNotes = notes.map((note) => {
            if (note.originalIndex === selectedNote.originalIndex) {
                return { ...note, title: updatedTitle, desc: updatedDesc };
            }
            return note;
        });

        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        setNotes(updatedNotes);

        document.getElementById("updateNotes").close();
    };

    return (
        <>
            <Layout resetInputs={resetInputs} onSearch={filterNotes}>
                <dialog id="createNotes" className="modal">
                    <div className="modal-box shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none w-11/12 max-w-full">
                        <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => document.getElementById("createNotes").close()}
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-4">CREATE NOTE</h3>
                        <form onSubmit={createNote}>
                            <label className="input input-bordered flex items-center gap-2 border-2 border-black rounded-none bg-base-300 mb-4">
                                <i className="bi bi-type-h1"></i>
                                <input ref={titleRef} type="text" className="grow text-xs" placeholder="Title ..." required />
                            </label>
                            <div
                                ref={ref}
                                className="my-4 p-0 rounded-none !h-96 bg-base-300 text-xs"
                            ></div>
                            <button type="submit" className="bg-base-300 btn border-black border-2 w-full rounded-none mt-4">SUBMIT</button>
                        </form>
                    </div>
                </dialog>
                <dialog id="viewNotes" className="modal">
                    <div className="modal-box shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none w-11/12 max-w-full bg-base-300">
                        <button onClick={() => document.getElementById("viewNotes").close()}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-4">VIEW NOTE</h3>
                        <div className="p-4 bg-base-100 border-2 border-black max-h-[70vh] overflow-y-auto">
                            {selectedNote ? (
                                <div>
                                    <h1 className="font-bold text-2xl truncate">{selectedNote.title}</h1>
                                    <p className="text-gray-600 mt-2">{selectedNote.date}</p>
                                    <div className="mt-4" dangerouslySetInnerHTML={{ __html: selectedNote.desc }}></div>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </dialog>
                <dialog id="updateNotes" className="modal">
                    <div className="modal-box shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none w-11/12 max-w-full">
                        <button onClick={() => document.getElementById("updateNotes").close()}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-4">UPDATE NOTE</h3>
                        <form onSubmit={updateNote}>
                            <label className="input input-bordered flex items-center gap-2 border-2 border-black rounded-none bg-base-300 mb-4">
                                <i className="bi bi-type-h1"></i>
                                <input ref={updateTitleRef} type="text" className="grow text-xs" placeholder="Title ..." required />
                            </label>
                            <div
                                ref={updateRef}
                                className="my-4 p-0 rounded-none !h-96 bg-base-300 text-xs"
                            ></div>
                            <button type="submit" className="bg-base-300 btn border-black border-2 w-full rounded-none mt-4">UPDATE</button>
                        </form>
                    </div>
                </dialog>
                <dialog id="deleteNotes" className="modal">
                    <div className="modal-box shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none">
                        <button
                            onClick={() => document.getElementById("deleteNotes").close()}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-4">DELETE NOTE</h3>
                        <p>Are you sure you want to delete this note?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                className="btn join-item shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black rounded-none bg-base-300 btn-sm"
                                onClick={deleteNote}
                            >
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </dialog>
                {filteredNotes.length === 0 && (
                    <div className="px-4 mt-20">
                        <div className="alert bg-base-100 border-2 border-black rounded-none shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <i className="bi bi-info-circle"></i>
                            <span>Notes not found.</span>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 px-4 !mt-20">
                    {filteredNotes.map((note, index) => (
                        <div className="col-span-1" key={index}>
                            <div className="card border-2 rounded-none bg-base-100 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <div className="card-body flex flex-col p-4">
                                    <div className="flex justify-between items-start">
                                        <h5 className="text-xl font-bold truncate">{note.title}</h5>
                                        <button
                                            onClick={() => togglePin(index)}
                                            className={`btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${note.pin}`}
                                        >
                                            <i className={`bi ${note.pin ? 'bi-pin-angle-fill' : 'bi-pin-angle'} ${note.pin}`}></i>
                                        </button>
                                    </div>
                                    <p className="card-text text-sm text-gray-600">{note.date}</p>
                                    <div className="mt-auto flex justify-end gap-2">
                                        <button
                                            onClick={() => openViewDialog(note)}
                                            className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            <i className="bi bi-search"></i>
                                        </button>
                                        <button
                                            onClick={() => openUpdateDialog(note)}
                                            className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            onClick={() => openDeleteDialog(index)}
                                            className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Layout>
        </>
    );
};

export default Notes;
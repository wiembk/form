import {useEffect, useState} from 'react';
import axios ,{AxiosResponse} from "axios"
import {format} from "date-fns";

import './App.css';

const baseUrl = "http://localhost:5000"

function App() {
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] =useState(null);


  const fetchEvents = async () => {
    const data= await axios.get('${basUrl}/events')
    const { events } = data.data
    setEventsList(events); }
  
  const handleChange= e => {
    setDescription(e.target.value);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete('${baseUrl}/event/${id}');
      const updatedList = eventsList.filter(event =>event.id =! id)
      setEventsList(updatedList);
    }catch (err){
      console.error(err.message);
    }
    }
  

  const handleEdit= (event) => {
    setEventId(event.id);
    setEditDescription(event.description);
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDescription) {
        const data = await axios.put('${basUrl}/event/${eventId}', {description: editDescription});
        const updatedEvent =data.data.event;
        const updatedList = eventsList.map(event => {
          if (event.id == eventId) {
            return event = updatedEvent
          }
          return event
        })
        setEventsList (updatedList)
      } else {
        const data =await axios.post('${baseUrl}/events', {description})
        setEventsList([...eventsList, data.data]);
        
      }
      setDescription('');
      setEditDescription('');
      setEventId(null);
    } catch(err) {
    console.error(err.message);
    }
  }

  useEffect(() =>{
    fetchEvents();
  }, [])


  return (
    <div className="App">
      <section>
        <form onSubmit= {handleSubmit}>
          <label htmlFor="descrip tion">Description</label>
          <input
            onChange={(e) =>handleChange(e,'description')}
            type="text"
            name="description"
            id="description"
            placeholder="Describe the event"
            value= {description}
            />
          <button type="submit">Submit</button>
        </form>
      </section>
      <section>
        <ul>
          {eventsList.map(event => {
            if (eventId == event.id) {
              return(
               <form onSubmit= {handleSubmit}>
                 <input
                  onChange={(e) =>handleChange(e,'edit')}
                  type="text"
                  name="editDescription"
                  id="editDescription"
                  value= {editDescription}
                 />
                 <button type="submit">Submit</button>
               </form>
              )
            }else {
             return (
              <li style = {{display:"flex"}} key={event.id}>
                {event.description}
                <button onClick={()=> handleEdit}>Edit</button>
                <button onClick={()=> handleDelete(event.id)}>x</button></li>
            )
}})}
        </ul>
      </section>
    </div>
  );

  function newFunction(err) {
    console.error(err.message);
  }
}

export default App;

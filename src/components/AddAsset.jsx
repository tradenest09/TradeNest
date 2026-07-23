import { useState } from "react";

export default function AddAsset(){

const [title,setTitle] = useState("");
const [description,setDescription] = useState("");
const [category,setCategory] = useState("");
const [price,setPrice] = useState("");
const [type,setType] = useState("Buy");



const handleSubmit = (e) => {
e.preventDefault();

fetch("http://localhost:9000/assets",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        title,
        description,
        category,
        price,
        type,
        ownerid:2
    })
})
.then(res => {

    if(res.status === 201){

        alert("Asset Added Successfully");

        setTitle("");
        setDescription("");
        setCategory("");
        setPrice("");
        setType("Buy");
    }
    else{
        alert("Could not add asset");
    }

});


};



return(

    <div className="card p-4">

        <h3>Add Asset</h3>

        <form onSubmit={handleSubmit}>

            <input
                className="form-control mb-3"
                placeholder="Title"
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
            />

            <textarea
                className="form-control mb-3"
                placeholder="Description"
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
            />

            <input
                className="form-control mb-3"
                placeholder="Category"
                value={category}
                onChange={(e)=>setCategory(e.target.value)}
            />

            <input
                className="form-control mb-3"
                placeholder="Price"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
            />

            <select
                className="form-control mb-3"
                value={type}
                onChange={(e)=>setType(e.target.value)}
            >
                <option>Sell</option>
                <option>Rent</option>
            </select>

            <button
                className="btn btn-primary"
            >
                Add Asset
            </button>

        </form>

    </div>

);


}

import { useEffect, useState } from "react";

export default function BrowseAssets() {

const [assets, setAssets] = useState([]);

useEffect(() => {

    fetch("http://localhost:9000/assets")
    .then(res => res.json())
    .then(data => {
        setAssets(data);
    })
    .catch(err => {
        console.log(err);
    });

}, []);

return (
    <div>

        <h3 className="mb-4">
            Available Assets
        </h3>

        <div className="row">

            {
                assets.map(asset => (

                    <div
                        key={asset.assetid}
                        className="col-md-4 mb-4"
                    >

                        <div className="card h-100 shadow">

                            <div className="card-body">

                                <span className="badge bg-success">
                                    {asset.type}
                                </span>

                                <h4 className="mt-3">
                                    {asset.title}
                                </h4>

                                <p>
                                    {asset.description}
                                </p>

                                <h5>
                                    ₹ {asset.price}
                                </h5>

                                <p className="text-muted">
                                    {asset.category}
                                </p>

                            </div>

                        </div>

                    </div>

                ))
            }

        </div>

    </div>
);


}

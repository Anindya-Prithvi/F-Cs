import React, { useEffect, useState } from 'react'
import { toCanvas } from 'qrcode'

const Authqrcode = ({qrurl}) => {
    const [cvas, setcvas] = useState(null);
    useEffect(() => {
        toCanvas(qrurl, { errorCorrectionLevel: 'H' }, function (err, canvas) {
            if (err) throw err
            else setcvas(canvas.toDataURL());
        })
    }, [])


    return (
        <div>
            <img src={cvas}/>
        </div>
    )
}

export default Authqrcode
import React from 'react'

export const LikeButton = () =>{
    return(
        <div>
            <svg width="400" height="400">
                <circle className="circle" fill="none" stroke="#68E534" stroke-width="20" cx="200" cy="200" r="190" class="circle" stroke-linecap="round" transform="rotate(-90 200 200) "/>
                <polyline className="polyline" fill="none" stroke="#68E534" stroke-width="24" points="88,214 173,284 304,138" stroke-linecap="round" stroke-linejoin="round" class="tick" />
            </svg>

        </div>
    )
}
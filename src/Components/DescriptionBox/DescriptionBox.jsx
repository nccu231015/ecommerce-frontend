import React from 'react'
import './DescriptionBox.css'

export const DescriptionBox = ({description}) => {
  const defaultDescription = (
    <>
      <p>
      An e-commerce website is on online platform that facilitates the buying and selling of products or services over the internet.
      It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and 
      conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their
      convenience, accessibility, and the global reach they offer.
      </p>
      <p>
      E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available 
      variations(e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.
      </p>
    </>
  );

  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
            {description && description.trim() !== '' ? (
              <div dangerouslySetInnerHTML={{ __html: description.split('\n').map(line => line.trim() === '' ? '<br />' : `<p>${line}</p>`).join('') }} />
            ) : (
              defaultDescription
            )}
        </div>
    </div>
  )
}

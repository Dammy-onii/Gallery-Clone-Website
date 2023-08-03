import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import './Gallery.css';

const PexelsGallery = () => {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const handleSearch = async (e, page = 1, q = "") => {
    e && e.preventDefault();
    const response = await axios.get("https://api.pexels.com/v1/search", {
      headers: {
        Authorization:
          "t6PbUwOBtTdBwxdfRDJ6bwjjuq699vig9impOYkt3NEmsngCuZU6dtou",
      },
      params: {
        query: q || query,
        per_page: 12,
        page: page,
      },
    });
    setPhotos((prevPhotos) => [...prevPhotos, ...response.data.photos]);
    setCurrentPage(page);
    setTotalPages(response.data.total_results / 12);
  };

  useEffect(() => {
    const randomSearchTerms = [
      "nature",
      "food",
      "travel",
      "music",
      "technology",
    ];
    const randomIndex = Math.floor(Math.random() * randomSearchTerms.length);
    handleSearch(null, 1, randomSearchTerms[randomIndex]);
  }, []);

  const handleDownload = (url, photographer) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${photographer}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleLoadMore = () => {
    handleSearch(null, currentPage + 1);
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    toggleModal();
  };

  return (
    <div>
      <div className="galleryForm">
        <h1>Gallery Preview - Pinterest Clone trial No 28</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for photos"
          />
          <button type="submit">Search</button>
        </form>
      </div>
      
      <div className="gallery">
        {photos.map((photo) => (
          <div key={photo.id} className="photo">
            <img
              src={photo.src.large}
              alt={photo.photographer}
            />
            <div className="photo-info">
              <h3>{photo.photographer}</h3>
              <p>{photo.description}</p>
              <div className="buttons">
                <button
                  onClick={() =>
                    handleDownload(photo.src.original, photo.photographer)
                  }
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentPage < totalPages && (
        <div className="load-more">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}
      <Modal isOpen={modalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {selectedPhoto?.photographer}
        </ModalHeader>
        <ModalBody>
          <img
            src={selectedPhoto?.src.original}
            alt={selectedPhoto?.photographer}
            onClick={() =>
              handleDownload(
                selectedPhoto?.src.original,
                selectedPhoto?.photographer
              )
            }
          />
          <p>{selectedPhoto?.description}</p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default PexelsGallery;

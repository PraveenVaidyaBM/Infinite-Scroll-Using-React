import { useState,useRef, useCallback } from "react"
import BookSearch from "./BookSearch"

function App() {

  const [query,setQuery] = useState('')
  const [pageNumber,setPageNumber] = useState(1)
  const {loading,error,books,loadmore} = BookSearch(query,pageNumber)

  const observer = useRef()
  const lastBook = useCallback(node => {
    if(loading) return
    if(observer.current) observer.current.disconnect() 
    observer.current = new IntersectionObserver(
      entries => {
        if(entries[0].isIntersecting && loadmore){
          setPageNumber(prevPageNumber => prevPageNumber + 1)
        }
      }
    )
    if(node) observer.current.observe(node)
  },[loading,loadmore])

  const handleBookSearch = (e) => {
    e.preventDefault()
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
        <input type="text" value={query} onChange={handleBookSearch}></input>
        {books.map((book,index) =>  
          book.length === index + 1 ? <div ref={lastBook} key={book}>{book}</div> :<div key={book}>{book}</div> 
        )}
        <div>{loading && "Loading...."}</div>
        <div>{error && "Error...."}</div>
    </>
  )
}

export default App

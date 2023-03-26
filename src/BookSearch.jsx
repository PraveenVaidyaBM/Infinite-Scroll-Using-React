import {useEffect, useState} from 'react'
import axios from 'axios'

export default function BookSearch(query,pageNumber) {

    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [books, setBooks] = useState([])
    const [loadmore,setLoadmore] = useState(false)

    useEffect(() => {
        setBooks([])
    },[])

    useEffect(() => {
            setLoading(true)
            setError(false)
            let cancel;
            axios.get(`http://openlibrary.org/search.json`,{params:{q:query,p:pageNumber},
            cancelToken:new axios.CancelToken(c => cancel = c)}).then(
                res => {
                    setBooks(prevBooks => {
                    return [new Set(...[...prevBooks,...res.data.docs.map(b => b.title)])]
                })
                setLoadmore(res.data.length > 0)
                setLoading(false)
                }).catch(e => {
                    if(axios.isCancel(e)) return;
                    setError(true)
                }
            )
            return () => cancel()
        },[query,pageNumber])

  return {loading,error,books,loadmore}
}

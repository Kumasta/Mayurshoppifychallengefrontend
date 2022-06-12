import React, { useState, useEffect } from 'react'
import axios from 'axios'


const CommentCard = ({ comment, i, item, updateInvetory, setUpdateInventory }) => {

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/inventory/${item.id}/comments/${comment.id}`)
      setUpdateInventory(!updateInvetory)
    } catch (err) {
      console.log(err)
    }
  }

  const handleRestore = async () => {
    try {
      await axios.patch(`/api/inventory/${item.id}/comments/${comment.id}`)
      setUpdateInventory(!updateInvetory)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='inline spaceBetween'>
      {comment.deleted === false ?
        <>
          <p>{i + 1}. {comment.text}</p>
          <button onClick={handleDelete}>Delete</button>
        </>
        :
        <>
          <p className='deleted'>{i + 1}. {comment.text}</p>
          <button onClick={handleRestore} >Restore</button>
        </>

      }
    </div>
  )
}

const EditInventory = ({ item, updateInvetory, setUpdateInventory, setIsEdit }) => {
  const [newInventory, setNewInventory] = useState({
    name: item.name,
    description: item.description,
  })

  const handleChange = (e) => {
    setNewInventory({ ...newInventory, [e.target.name]: e.target.value })
    console.log(newInventory)
  }

  const handleSubmit = async () => {
    try {
      const { data } = await axios.put(`/api/inventory/${item.id}`,
        newInventory
      )
      console.log(data)
      setUpdateInventory(!updateInvetory)
      setIsEdit(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='border'>
      <h4>Edit Inventory</h4>
      <form>
        <label htmlFor="name">Name of Item </label>
        <input onChange={handleChange} type="text" id='name' name='name' value={newInventory.name} />
        <br />
        <label htmlFor="description">Description </label>
        <input onChange={handleChange} type="text" name="description" id="description" value={newInventory.description} />
      </form>
      <button onClick={handleSubmit}>Edit Inventory</button>
    </div>
  )

}

const InventoryCard = ({ item, order, updateInvetory, setUpdateInventory }) => {

  let [stockCount, setStockCouint] = useState(item.stock)
  const [isEdit, setIsEdit] = useState(false)

  const handleEdit = () => {
    setIsEdit(!isEdit)
  }

  const handlePlus = () => {
    setStockCouint(stockCount += 1)
    updateStock()
  }

  const handleMinus = () => {
    if (stockCount === 0) return
    setStockCouint(stockCount -= 1)
    updateStock()
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/inventory/${item.id}`)
      setUpdateInventory(!updateInvetory)
    } catch (err) {
      console.log(err)
    }
  }

  const updateStock = async () => {
    try {
      const { data } = await axios.put(`/api/inventory/${item.id}`,
        { stock: stockCount }
      )
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  const [commentBody, setCommentBody] = useState('')

  const handleChange = (e) => {
    e.preventDefault()
    setCommentBody(e.target.value)
  }

  const handleNewComment = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`/api/inventory/${item.id}/comments`,
        { text: commentBody }
      )
      setUpdateInventory(!updateInvetory)
      setCommentBody('')
      console.log(data)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='border inventoryCard'>
      <div className='border'>
        <h3>{order}. {item.name}</h3>
        <p>{item.description}</p>
        <button onClick={handleEdit}>Edit</button><button onClick={handleDelete}>Delete</button>
      </div>
      {isEdit && <EditInventory item={item} updateInvetory={updateInvetory} setUpdateInventory={setUpdateInventory} setIsEdit={setIsEdit} />}
      <div className='border inline'>
        <p>Stock: {stockCount}</p>
        <button onClick={handlePlus}>+</button><button disabled={stockCount <= 0} onClick={handleMinus}>-</button>
      </div>
      <h4>Comments:</h4>
      <form>
        <input type='text' name='comment' id='comment' value={commentBody} onChange={handleChange} />
        <input type='submit' value='Add Comment' disabled={commentBody === ''} onClick={handleNewComment} />
      </form>
      {item.comments.length > 0 ? item.comments.map((comment, i) => <CommentCard key={i} i={i} item={item} comment={comment} updateInvetory={updateInvetory} setUpdateInventory={setUpdateInventory} />)
        :
        'No Comments'
      }
    </div>
  )
}

const InventoryForm = ({ updateInvetory, setUpdateInventory }) => {

  const [newInventory, setNewInventory] = useState({
    name: '',
    description: '',
    stock: 0
  })

  const handleChange = (e) => {
    setNewInventory({ ...newInventory, [e.target.name]: e.target.value })
    console.log(newInventory)
  }

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`/api/inventory`,
        newInventory
      )
      console.log(data)
      setNewInventory({
        name: '',
        description: '',
        stock: 0
      })
      setUpdateInventory(!updateInvetory)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <h1>Add New Inventory</h1>
      <form>
        <label htmlFor="name">Name of Item </label>
        <input onChange={handleChange} type="text" id='name' name='name' value={newInventory.name} />
        <label htmlFor="description">Description </label>
        <input onChange={handleChange} type="text" name="description" id="description" value={newInventory.description} />
        <label htmlFor="stock">Stock </label>
        <input onChange={handleChange} type="number" name="stock" id="stock" min={0} value={newInventory.stock} />
      </form>
      <button onClick={handleSubmit}>Add Inventory</button>
    </>
  )
}

const InventoryList = ({ updateInvetory, setUpdateInventory, invetoryList, isError }) => {


  return (
    <>
      <h1>Inventory: </h1>
      {isError ? 'There was an issue...'
        :
        invetoryList ? invetoryList.map((item, i) => {
          return (
            <InventoryCard item={item} key={i} order={i + 1} updateInvetory={updateInvetory} setUpdateInventory={setUpdateInventory} />
          )
        }) : 'Laoding...'}
    </>
  )
}

const DeletedInventoryList = ({ updateInvetory, setUpdateInventory, deletedInventoryList }) => {

  return (
    <div>
      <h4>Delted Inventory</h4>
      <ol>
        {deletedInventoryList && deletedInventoryList.map((item, i) => {
          return (
            <DeletedListItem key={i} updateInvetory={updateInvetory} setUpdateInventory={setUpdateInventory} item={item} />
          )
        })}
      </ol>
    </div>
  )
}

const DeletedListItem = ({ updateInvetory, setUpdateInventory, item }) => {

  const handleRestore = async () => {
    console.log(item)
    try {
      await axios.patch(`/api/inventory/${item.id}`)
      setUpdateInventory(!updateInvetory)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <li>
      {item.name} - {item.deletedComment.slice(0, 42)} <button onClick={handleRestore}>Restore</button>
    </li>
  )
}


const App = () => {
  const [updateInvetory, setUpdateInventory] = useState(false)
  const [invetoryList, setInventory] = useState(null)
  const [deletedInventoryList, setDeletedInventoryList] = useState(null)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const getInventory = async () => {
      try {
        const { data } = await axios.get('/api/inventory')
        setInventory(data.filter(item => item.deleted === false))
        setDeletedInventoryList(data.filter(item => item.deleted === true))
        console.log(data)
      } catch (err) {
        console.log(err)
        setIsError(true)
      }
    }
    getInventory()
  }, [updateInvetory])

  return (
    <>
      <InventoryForm updateInvetory={updateInvetory} setUpdateInventory={setUpdateInventory} />
      <InventoryList updateInvetory={updateInvetory} setUpdateInventory={setUpdateInventory} invetoryList={invetoryList} isError={isError} />
      <DeletedInventoryList updateInvetory={updateInvetory} setUpdateInventory={setUpdateInventory} deletedInventoryList={deletedInventoryList} />
    </>
  );
}

export default App;


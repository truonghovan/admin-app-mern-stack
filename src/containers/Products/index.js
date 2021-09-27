import React, { useState } from 'react'
import Layout from '../../components/Layout'
import { Col, Container, Row, Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Input from '../../components/UI/Input'
import { addProduct } from '../../actions/product'
import { NewModal as Modal } from '../../components/UI/Modal'
import './style.css'
import { generatePublicUrl } from '../../urlConfig'
import { deleteProductById } from '../../actions'

/**
* @author
* @function Products
**/

const Products = (props) => {

  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [productPicture, setProductPicture] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [productDetailsModal, setProductDetailsModal] = useState(false)
  const [productDetails, setProductDetails] = useState(null)
  const [show, setShow] = useState(false)
  const dispatch = useDispatch();
  const product = useSelector(state => state.product)
  const category = useSelector((state) => state.category)
  const handleClose = () => {
    const form = new FormData()
    form.append('name', name)
    form.append('quantity', quantity)
    form.append('price', price)
    form.append('description', description)
    form.append('category', categoryId)

    for (let pic of productPicture) {
      form.append('productPicture', pic)
    }


    dispatch(addProduct(form))


    setShow(false)
  }
  const handleShow = () => {
    setShow(true)
  }
  const createCategoryList = (categories, options = []) => {
    for (let category of categories) {
      options.push({ value: category._id, name: category.name })
      if (category.children.length > 0) {
        createCategoryList(category.children, options)
      }
    }
    return options
  }

  const handleProductPictures = (e) => {
    setProductPicture([
      ...productPicture,
      e.target.files[0]
    ])
  }

  const renderProducts = () => {
    console.log(product)
    return (
      <Table style={{ fontSize: 12 }} responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {
            product.products.length > 0 ?
              product.products.map(product =>
                <tr key={product._id}>
                  <td>1</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.category.name}</td>
                  <td>
                    <button onClick={() => showProductDetailsModal(product)}>
                      Info
                    </button>
                    <button
                      onClick={() => {
                        const payload = {
                          productId: product._id,
                        };
                        dispatch(deleteProductById(payload));
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ) : null
          }
        </tbody>
      </Table>
    )
  }

  const renderAddProductModal = () => {
    return (
      <Modal show={show} handleClose={handleClose} modalTitle={'Add New Product'}>
        <Input
          label="Name"
          value={name}
          placeholder={'Product Name'}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <Input
          label="Quantity"
          value={quantity}
          placeholder={'Product Quantity'}
          onChange={(e) => {
            setQuantity(e.target.value)
          }}
        />
        <Input
          label="Price"
          value={price}
          placeholder={'Product Price'}
          onChange={(e) => {
            setPrice(e.target.value)
          }}
        />
        <Input
          label="Description"
          value={description}
          placeholder={'Product Description'}
          onChange={(e) => {
            setDescription(e.target.value)
          }}
        />
        <ul></ul>
        <select className='form-control' value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option>Option Category</option>
          {
            createCategoryList(category.categories).map(option =>
              <option
                key={option.value}
                value={option.value}>{option.name}
              </option>
            )
          }
        </select>
        <ul></ul>
        {
          productPicture.length > 0 ?
            productPicture.map((pic, index) => <div key={index}>{JSON.stringify(pic.name)}</div>) : null
        }
        <input type='file' name="productPicture" onChange={handleProductPictures} />
      </Modal>

    )
  }

  const handleCloseProductDetailsModal = () => {
    setProductDetailsModal(false)
  }

  const showProductDetailsModal = (product) => {
    setProductDetails(product)
    setProductDetailsModal(true)
    console.log(product)
  }

  const renderProductsDetailsModal = () => {
    if (!productDetails) {
      return null
    }

    return (
      <Modal
        show={productDetailsModal}
        handleClose={handleCloseProductDetailsModal}
        modalTitle={'Product Details'}
        size="lg"
      >
        <Row>
          <Col md="6">
            <label className="key">Name</label>
            <p className="value">{productDetails.name}</p>
          </Col>
          <Col md="6">
            <label className="key">Price</label>
            <p className="value">{productDetails.price}</p>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <label className="key">Quantity</label>
            <p className="value">{productDetails.quantity}</p>
          </Col>
          <Col md="6">
            <label className="key">Category</label>
            <p className="value">{productDetails.category.name}</p>
          </Col>
        </Row>
        <Row>
          <Col md="6">
            <label className="key">Description</label>
            <p className="value">{productDetails.description}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <label className="key ">Product Pictures</label>
            <div style={{ display: 'flex' }}>
              {productDetails.productPicture.map(picture =>
                <div className="productImgContainer">
                  <img src={generatePublicUrl(picture.img)} />
                </div>
              )}
            </div>
          </Col>
        </Row>

      </Modal>
    )
  }

  return (

    <Layout sidebar>
      <Container>
        <Row>
          <Col md={12}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>Product</h3>
              <button onClick={handleShow}>Add Product</button>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {renderProducts()}
          </Col>
        </Row>
      </Container>
      {renderAddProductModal()}
      {renderProductsDetailsModal()}
    </Layout>
  )

}
export default Products
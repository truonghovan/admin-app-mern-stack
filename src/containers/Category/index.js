import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Button } from 'react-bootstrap'
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, getAllCategory, updateCategories, deleteCategories as deleteCategoriesAction } from '../../actions/category'
import Layout from '../../components/Layout'
import Input from '../../components/UI/Input'
import { NewModal as Modal } from '../../components/UI/Modal'
import CheckboxTree from 'react-checkbox-tree'
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { IoIosCheckboxOutline, IoIosCheckbox, IoIosArrowForward, IoIosArrowDown, IoIosAdd, IoIosTrash, IoIosCloudUpload } from 'react-icons/io'
import UpdateCategoriesModal, { UpdateCategoryModal } from './components/UpdateCategoriesModal'
import AddCategoryModal from './components/AddCategoriesModal'
import './style.css'

/**
* @author
* @function Category
**/

export const Category = (props) => {
    const category = useSelector(state => state.category)
    const [categoryName, setCategoryName] = useState('')
    const [parentCategoryId, setParentCategoryId] = useState('')
    const [categoryImage, setCategoryImage] = useState('')
    const dispatch = useDispatch()
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState([])
    const [expanded, setExpanded] = useState([])
    const [checkedArray, setCheckedArray] = useState([])
    const [expandedArray, setExpandedArray] = useState([])
    const [updateCategoryModal, setUpdateCategoryModal] = useState(false)
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false)


    useEffect(()=>{
        if(!category.loading){
            setShow(false)
        }
    },[category.loading])
    const handleClose = () => {
        const form = new FormData()

        if (categoryName === "") {
            alert("Name is required")
            setShow(false)
            return
        } 



        form.append('name', categoryName)
        form.append('parentId', parentCategoryId)
        form.append('categoryImage', categoryImage)
        dispatch(addCategory(form))
            .then(result => {
                if (result) {
                    setShow(false)
                    dispatch(getAllCategory())

                }
            })
        setShow(false)
        setCategoryName('');
        setParentCategoryId('');
        dispatch(getAllCategory())



    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        dispatch(getAllCategory())
    }, [])

    const renderCategories = (categories) => {
        let myCategories = [];
        for (let category of categories) {
            myCategories.push(
                {
                    label: category.name,
                    value: category._id,
                    children: category.children.length > 0 && renderCategories(category.children)
                }

            );
        }
        //console.log(myCategories)
        return myCategories;
    }

    const deleteCategory = () => {
        updateCheckedAndExpandedCategories()
        setDeleteCategoryModal(true)
    }
    const updateCategory = () => {
        updateCheckedAndExpandedCategories()
        setUpdateCategoryModal(true)
    }

    const deleteCategories = () => {
        const checkedIdsArray = checkedArray.map((item, index) => ({ _id: item.value }))
        const expandedIdsArray = expandedArray.map((item, index) => ({ _id: item.value }))
        const idsArray = expandedIdsArray.concat(checkedIdsArray)
        if (checkedArray.length > 0) {
            dispatch(deleteCategoriesAction(checkedIdsArray))
                .then(result => {
                    if (result) {
                        //dispatch(getAllCategory())

                    }
                })
        }
        setDeleteCategoryModal(false)
        dispatch(getAllCategory())
    }

    const updateCheckedAndExpandedCategories = () => {
        const categories = createCategoryList(category.categories)
        const checkedArray = []
        const expandedArray = []
        checked.length > 0 && checked.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId === category.value)
            category && checkedArray.push(category)
        })
        expanded.length > 0 && expanded.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId === category.value)
            category && expandedArray.push(category)
        })
        setCheckedArray(checkedArray)
        setExpandedArray(expandedArray)
    }

    const handleCategoryInput = (key, value, index, type) => {
        console.log(value);
        if (type == "checked") {
            const updatedCheckedArray = checkedArray.map((item, _index) =>
                index == _index ? { ...item, [key]: value } : item);
            setCheckedArray(updatedCheckedArray);
        } else if (type == "expanded") {
            const updatedExpandedArray = expandedArray.map((item, _index) =>
                index == _index ? { ...item, [key]: value } : item);
            setExpandedArray(updatedExpandedArray);
        }
    }

    const createCategoryList = (categories, options = []) => {

        for (let category of categories) {
            options.push({
                value: category._id,
                name: category.name,
                parentId: category.parentId,
                type: category.type
            });
            if (category.children.length > 0) {
                createCategoryList(category.children, options)
            }
        }

        return options;
    }

    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0])
    }
    const updateCategoriesForm = () => {
        const form = new FormData()


        expandedArray.forEach((item, index) => {
            form.append('_id', item.value)
            form.append('name', item.name)
            form.append('parentId', item.parentId ? item.parentId : "")
            form.append('type', item.type)
        })
        checkedArray.forEach((item, index) => {
            form.append('_id', item.value)
            form.append('name', item.name)
            form.append('parentId', item.parentId ? item.parentId : "")
            form.append('type', item.type)
        })

        dispatch(updateCategories(form))
            .then(result => {
                if (result) {
                    dispatch(getAllCategory())

                }
            })
        dispatch(getAllCategory())
        setUpdateCategoryModal(false)

    }


    const renderDeleteCategoryModal = () => {
        return (
            <Modal
                modalTitle="Confirm"
                show={deleteCategoryModal}
                handleClose={() => setDeleteCategoryModal(false)}
                buttons={[
                    {
                        label: 'No',
                        color: 'primary',
                        onClick: () => {
                            alert('no')
                        }
                    },
                    {
                        label: 'Yes',
                        color: 'danger',
                        onClick: deleteCategories
                    }
                ]}
            >
                <h5>Expanded</h5>
                {
                    expandedArray.map((item, index) => <span key={index}>{item.name}</span>)
                }
                <h5>Checked</h5>
                {
                    checkedArray.map((item, index) => <span key={index}>{item.name}</span>)
                }


            </Modal>
        )
    }
    const categoryList = createCategoryList(category.categories)
    return (
        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Category</h3>
                            <div className="actionBtnContainer">
                                <span>Actions </span>
                                <button onClick={handleShow}> <IoIosAdd /><span>Add </span></button>
                                <button onClick={deleteCategory}><IoIosTrash /><span>Delete</span></button>
                                <button onClick={updateCategory}><IoIosCloudUpload /> <span>Edit</span></button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>

                        {/* <ul>
                              {renderCategories(category.categories)}  
                        </ul> */}
                        <CheckboxTree
                            nodes={renderCategories(category.categories)}
                            checked={checked}
                            expanded={expanded}
                            onCheck={checked => setChecked(checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={{
                                check: <IoIosCheckbox />,
                                uncheck: <IoIosCheckboxOutline />,
                                halfCheck: <IoIosCheckboxOutline />,
                                expandClose: <IoIosArrowForward />,
                                expandOpen: <IoIosArrowDown />,
                            }}
                        />

                    </Col>
                </Row>

            </Container>
            <AddCategoryModal
                show={show}
                handleClose={()=>setShow(false)}
                onSubmit={handleClose}
                modalTitle={'Add New Category'}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                parentCategoryId={parentCategoryId}
                setParentCategoryId={setParentCategoryId}
                categoryList={categoryList}
                handleCategoryImage={handleCategoryImage}
            />
            <UpdateCategoriesModal
                show={updateCategoryModal}
                handleClose={()=>{setUpdateCategoryModal(false)}}
                onSubmit={updateCategoriesForm}
                modalTitle={'Update Categories'}
                size='lg'
                expandedArray={expandedArray}
                checkedArray={checkedArray}
                handleCategoryInput={handleCategoryInput}
                categoryList={categoryList}
            />
            {renderDeleteCategoryModal()}
        </Layout>
    )

}
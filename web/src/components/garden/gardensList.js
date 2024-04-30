import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { useAddNewGardenMutation, useDeleteGardenMutation, useGetAllGardensQuery } from '../../api/apiSlice'

export const GardensList = () => {
    const {
        data: garden_list,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetAllGardensQuery()

    let content = null
    const [deleteGarden] = useDeleteGardenMutation()
    const [addGarden] = useAddNewGardenMutation()

    const [gardenName, setGardenName] = useState('')

    const onGardenNameChange = e => setGardenName(e.target.value)

    const canSave = [gardenName].every(Boolean) && !isLoading

    const onSaveClicked = async () => {
        if (canSave) {
            try {
                await addGarden({ name: gardenName })
                setGardenName('')
            }
            catch (err) {
                alert(err)
            }
        }
    }

    if (isLoading) {
        content = (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải nội dung...</span>
            </div>
        )
    }
    else if (isSuccess) {
        let pre_content = (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Mã vườn</th>
                        <th scope="col">Tên vườn</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {garden_list.data.map(garden => (
                        <tr>
                            <th>{garden._id}</th>
                            <td>{garden.name}</td>
                            <td>
                                <Link to={`/gardens/${garden._id}/rooms`} className='btn btn-primary'>Danh sách phòng trong vườn</Link>
                                <button className='btn btn-danger' onClick={async () => { await deleteGarden(garden._id).unwrap() }}>Xoá vườn</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
        const containerClassname = classnames('gardens-container', {
            disabled: isFetching
        })
        content = <div className={containerClassname}>{pre_content}</div>
    }
    else if (isError) {
        content = <h6 class="text-danger">{error.toString()}</h6>
    }

    return (
        <div className='container-md'>
            <h2>Danh sách vườn </h2>
            <div className='row align-items-center'>
                <div className='col-auto'>
                    <form>
                        <label for="gardenName" className="form-label">Tên vườn mới:</label>
                        <input
                            type="text"
                            className='form-control'
                            id="gardenName"
                            name="gardenName"
                            value={gardenName}
                            onChange={onGardenNameChange}
                        />
                    </form>
                </div>
                <div className='col-auto'>
                    <button className='btn btn-primary' onClick={onSaveClicked}>Thêm vườn mới</button>
                </div>
            </div>
            <div className='row justify-content-end'>
                <div className='col-auto'>
                    <button className='btn btn-primary mx-2' onClick={refetch}>Làm mới danh sách vườn</button>
                </div>
            </div>
            <div className='row justify-content-center'>
                <div className='col'>
                    {content}
                </div>
            </div>
        </div>
    )
}
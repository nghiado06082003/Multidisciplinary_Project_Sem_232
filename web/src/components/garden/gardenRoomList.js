import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import classnames from 'classnames'
import { useAddNewRoomMutation, useDeleteRoomMutation, useGetRoomByGardenIdQuery } from '../../api/apiSlice'

export const GardenRoomList = () => {
    const { garden_id } = useParams()
    const {
        data: room_list,
        isLoading,
        isFetching,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetRoomByGardenIdQuery(garden_id)

    let content = null
    const [deleteRoom] = useDeleteRoomMutation()
    const [addRoom] = useAddNewRoomMutation()

    const [roomName, setRoomName] = useState('')
    const onRoomNameChange = e => setRoomName(e.target.value)

    const onSaveClicked = async () => {
        try {
            await addRoom({ garden_id: garden_id, name: roomName })
            setRoomName('')
        }
        catch (err) {
            alert(err)
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
                        <th scope="col">Mã phòng</th>
                        <th scope="col">Tên phòng</th>
                        <th scope="col">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {room_list.data.map(room => (
                        <tr>
                            <th>{room._id}</th>
                            <td>{room.name}</td>
                            <td>
                                <Link to={`/gardens/${garden_id}/rooms/${room._id}/devices`} className='btn btn-primary'>Thông tin thiết bị trong phòng</Link>
                                <button className='btn btn-danger' onClick={async () => { await deleteRoom(room._id).unwrap() }}>Xoá phòng</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
        const containerClassname = classnames('rooms-container', {
            disabled: isFetching
        })
        content = <div className={containerClassname}>{pre_content}</div>
    }
    else if (isError) {
        content = <h6 class="text-danger">{error.toString()}</h6>
    }

    return (
        <div className='container-md'>
            <h2>Danh sách phòng trong vườn </h2>
            <div className='row align-items-center'>
                <div className='col-auto'>
                    <form>
                        <label for="roomName" className="form-label">Tên phòng muốn thêm</label>
                        <input
                            type="text"
                            className='form-control'
                            id="roomName"
                            name="roomName"
                            value={roomName}
                            onChange={onRoomNameChange}
                        />
                    </form>
                </div>
                <div className='col-auto'>
                    <button className='btn btn-primary' onClick={onSaveClicked}>Thêm phòng mới</button>
                </div>
            </div>
            <div className='row justify-content-end'>
                <div className='col'>
                    <button className='btn btn-primary' onClick={refetch}>Làm mới</button>
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
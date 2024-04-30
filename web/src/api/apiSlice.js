import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const apiSlice = createApi({
    reducerPath: 'api',

    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),

    tagTypes: ['Device', 'Garden', 'Room'],

    endpoints: builder => ({
        login: builder.mutation({
            query: login_info => ({
                url: "/login",
                method: "POST",
                body: login_info,
            })
        }),
        signup: builder.mutation({
            query: signup_info => ({
                url: "/signup",
                method: "POST",
                body: signup_info
            })
        }),
        getAllDevices: builder.query({
            query: () => ({
                url: "/v1/device",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getDeviceById: builder.query({
            query: device_id => ({
                url: `/v1/device/${device_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesWithLog: builder.query({
            query: () => ({
                url: "/v2/device",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getDeviceByIdWithLog: builder.query({
            query: device_id => ({
                url: `/v2/device/${device_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByGardenId: builder.query({
            query: garden_id => ({
                url: `/v3/device/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByRoomId: builder.query({
            query: room_id => ({
                url: `/v3/device/room/${room_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByGardenIdWithLog: builder.query({
            query: garden_id => ({
                url: `/v4/device/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        getAllDevicesByRoomIdWithLog: builder.query({
            query: room_id => ({
                url: `/v4/device/room/${room_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Device']
        }),
        updateDeviceData: builder.mutation({
            query: device_data => ({
                url: `/v1/device/${device_data.device_id}`,
                method: "PUT",
                body: device_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Device']
        }),
        addNewDevice: builder.mutation({
            query: device_data => ({
                url: `/v1/device`,
                method: "POST",
                body: device_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Device']
        }),
        deleteDevice: builder.mutation({
            query: device_id => ({
                url: `/v1/device/${device_id}`,
                method: "DELETE",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Device']
        }),
        getAllGardens: builder.query({
            query: () => ({
                url: "/v1/garden",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Garden']
        }),
        getGardenById: builder.query({
            query: garden_id => ({
                url: `/v1/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Garden']
        }),
        addNewGarden: builder.mutation({
            query: garden_data => ({
                url: "/v1/garden",
                method: "POST",
                body: garden_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Garden']
        }),
        deleteGarden: builder.mutation({
            query: garden_id => ({
                url: `/v1/garden/${garden_id}`,
                method: "DELETE",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Garden']
        }),
        getAllRooms: builder.query({
            query: () => ({
                url: "/v1/room",
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Room']
        }),
        getRoomById: builder.query({
            query: room_id => ({
                url: `/v1/room/${room_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Room']
        }),
        getRoomByGardenId: builder.query({
            query: garden_id => ({
                url: `/v2/room/garden/${garden_id}`,
                method: "GET",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            providesTags: ['Room']
        }),
        addNewRoom: builder.mutation({
            query: room_data => ({
                url: "/v1/room",
                method: "POST",
                body: room_data,
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Room']
        }),
        deleteRoom: builder.mutation({
            query: room_id => ({
                url: `/v1/room/${room_id}`,
                method: "DELETE",
                headers: {
                    "access-token": cookies.get("access-token")
                }
            }),
            invalidatesTags: ['Room']
        })
    })
})


export const {
    // Login - Signup Hooks
    useLoginMutation,
    useSignupMutation,
    // Device Hooks
    useGetAllDevicesQuery,
    useGetDeviceByIdQuery,
    useGetAllDevicesWithLogQuery,
    useGetDeviceByIdWithLogQuery,
    useGetAllDevicesByGardenIdQuery,
    useGetAllDevicesByRoomIdQuery,
    useGetAllDevicesByGardenIdWithLogQuery,
    useGetAllDevicesByRoomIdWithLogQuery,
    useUpdateDeviceDataMutation,
    useAddNewDeviceMutation,
    useDeleteDeviceMutation,
    // Garden Hooks
    useGetAllGardensQuery,
    useGetGardenByIdQuery,
    useAddNewGardenMutation,
    useDeleteGardenMutation,
    // Room Hooks
    useGetAllRoomsQuery,
    useGetRoomByIdQuery,
    useGetRoomByGardenIdQuery,
    useAddNewRoomMutation,
    useDeleteRoomMutation
} = apiSlice
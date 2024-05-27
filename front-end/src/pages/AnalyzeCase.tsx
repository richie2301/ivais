import React, { useEffect, useState, useRef } from 'react';
import { Layout, Row, Col, Typography, Tag, Space, Divider, Input, Modal, Select, Button, Avatar, Spin } from 'antd'
import dayjs from 'dayjs';
import { TimePicker } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
// import { RangeValueType } from 'antd/es/time-picker'
// import { RangePickerTimeProps } from 'antd/es/date-picker';
import ReactPlayer from 'react-player';
import { TimelineState } from '@xzdarcy/react-timeline-editor'; 

import { HubConnection } from '@microsoft/signalr';

import useCaseCreationStore from '../store/caseCreationStore';
import { caseCreationStoreType, UserStoreState } from '../type/storeTypes'; 
import { FaceDataType, PeopleAttributeType } from '../components/MissionDetailsDrawer'
import useUserStore from '../store/userStore';

import EvidenceList from '../components/EvidenceList'
// import ActivityLog from '../components/ActivityLog'
// import PeopleMetadata from '../components/PeopleMetadata'
// import AttributeMetadata from '../components/AttributeMetadata'
import Notes from '../components/Notes'
import Filter from '../components/Filter'

import CaseTimeline from '../components/CaseTimeline'
import AttributeList from '../components/AttributeList'
import FaceList from '../components/FaceList'
import ActivityLog from '../components/ActivityLog';
import NewEvidenceList from '../components/NewEvidenceList'
import { useNavigate } from 'react-router-dom';
// import { RangePickerTimeProps } from 'antd/es/time-picker';

const { Text, Title } = Typography;
const { TextArea } = Input;

const url = import.meta.env.VITE_API_URL;

type AnalyzeCaseProps = {
  success: (message: string) => void;
  connection: HubConnection | null;
}

const AnalyzeCase : React.FC<AnalyzeCaseProps> = ({success, connection}) => {

  const navigate = useNavigate()

  const [newEvidenceList, setNewEvidenceList] = useState([])
  const [reloadEvidenceList, setReloadEvidenceList] = useState(false)

  const [currentCaseData, setCurrentCaseData] = useState<any>()
  const [spinEvidenceList, setSpinEvidenceList] = useState(false)
  const [spinMetadata, setSpinMetadata] = useState(false)

  const getEvidenceList = () => {
    // setSpinEvidenceList(true)
    fetch (url + '/api/Case/GetCase/?caseId=' + caseId, {
    // fetch (url + '/api/Evidence/case/filter?caseId=' + caseId + '&userId=' + userId + filterUrl, {
      method: 'GET'
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      console.log(data);
      if (data) {
        if (data.evidences.length !== 0) {
          setCurrentCaseData(data)
          setPersonBaseFilter(data.personBaseFilter)
          // setEvidenceList(data.evidences);
          setCurrentEvidenceId(data.evidences[0].evidenceId)
          setCurrentId(data.evidences[0].id)
          // setVideoUrl(url + '/CaseEvidenceVideoAttachment?evidenceId=' + data[0].evidenceId)
          setObjective(data.objective)
          // setSpinEvidenceList(false)
        }
      }
    }).catch((error) => {
      console.error("There was a problem with the fetch operation:", error)
    })
  }

  const getFilteredEvidence = () => {
    setSpinEvidenceList(true)
    fetch(url + '/api/Evidence/case/filter?caseId=' + caseId + '&userId=' + userId + filterUrl, {
    // fetch (url + '/api/Evidence/case/filter?caseId=' + caseId + '&userId=' + userId + filterUrl, {
      method: 'GET'
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }).then((data) => {
      console.log(data);
      if (data) {
        if (data.evidences.length !== 0) {
          setCurrentEvidenceId(data.evidences[0].evidenceId)
          setVideoUrl(url + '/CaseEvidenceVideoAttachment?evidenceId=' + data.evidences[0].evidenceId)
        }
        setEvidenceList(data.evidences);
        setNewEvidenceList(data.newEvidences)
        setSpinEvidenceList(false)
      }
    }).catch((error) => {
      console.error("There was a problem with the fetch operation:", error)
    })
  }

  // const getNewEvidenceList = () => {
  //   fetch(url + '/api/Evidence/NewEvidenceList?caseId=' + caseId, {
  //     method: 'GET'
  //   }).then((response) => {
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     return response.json();
  //   }).then((data) => {
  //     setNewEvidenceList(data)
  //   }).catch((error) => {
  //     console.error("There was a problem with the fetch operation:", error)
  //   })
  // }
 
  // useEffect(() => {
  //   console.log(newEvidenceList)
  // }, [newEvidenceList])

  useEffect(() => {
    if (connection) {
        connection.start()
            .then(result => {
                console.log('Connected!');
                console.log(result);
  
                // connection.on('ReceiveMessage', message  => {
                //     // const updatedChat = [...latestChat.current];
                //     // updatedChat.push(message);
                
                //     // setChat(updatedChat);
                    
                //     messageApi.open({
                //       type: 'success',
                //       content: message,
                //       duration: 10,
                //     });
                //     // location.reload()
                //     console.log(message);
                // });
  
                connection.on('ReceiveMessage', function(message, value) {
                  if (message == "new evidence") {
                    console.log(JSON.parse(value));
                    const updatedNewEvidence : any = [...newEvidenceList, JSON.parse(value)]
                    setNewEvidenceList(updatedNewEvidence)
                  }
              });
            })
            .catch(e => console.log('Connection failed: ', e));
    }
  }, [connection]);

  const ref = useRef<ReactPlayer>(null);
  const timelineRef = useRef<TimelineState | null>(null)
  const caseId = (useCaseCreationStore.getState() as caseCreationStoreType).caseId;
  const [evidenceList, setEvidenceList] = useState([])
  const [currentEvidenceId, setCurrentEvidenceId] = useState<string>()
  const [currentId, setCurrentId] = useState<string>()
  const [videoUrl, setVideoUrl] = useState<string>()
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect (() => {
    if (currentEvidenceId !== undefined) {
      fetch(url + '/CaseEvidenceVideoAttachment?evidenceId=' + currentEvidenceId, {
        headers: {
            'content-type': 'multipart/byteranges',
            'range': 'bytes=2-5,10-13',
        },
      })
      .then(response => {
          if (response.ok) {
              // return response.text();
              console.log(response.text())
          }
      })
      .then(response => {
          console.log(response);
      });
    }
  }, [currentEvidenceId])

  const seek = (a : number) => {
    ref.current?.seekTo(a);
    timelineRef.current?.setTime(a);
    timelineRef.current?.setScrollLeft(a*30);
    setIsPlaying(false);
  }

  const handleStop = () => {
    ref.current?.seekTo(0);
    timelineRef.current?.setTime(0);
    timelineRef.current?.setScrollLeft(0);
    setIsPlaying(false);
  }

  const [personBaseFilter, setPersonBaseFilter] = useState([])

    useEffect(() => {
      setVideoUrl(url + '/CaseEvidenceVideoAttachment?evidenceId=' + currentEvidenceId)
      console.log(currentEvidenceId)
    }, [currentEvidenceId])

    const [faceData, setFaceData] = useState<FaceDataType[]>([])
    const [peopleAttribute, setPeopleAttribute] = useState<PeopleAttributeType[]>([])
    // const [attributePhotos, setAttributePhotos] = useState<string[]>([])
    const [reloadNote, setReloadNote] = useState(false)

    useEffect(() => {
      if(currentEvidenceId) {
        setSpinMetadata(true)
        fetch(url + '/GetCaseEvidenceById?evidenceId=' + currentEvidenceId, {
          method: "GET",
          headers: {
            'Content-Type': "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            else {
                return response.json()
            }
        })
        .then((data) => {
            console.log(data);
            setIsPlaying(false);
            setPeopleAttribute(data.peopleAttributeData);
            setFaceData(data.faceRecognitionData);
            // setAttributePhotos(data.attributePhotos);
            setFilteredPeopleAttribute(data.peopleAttributeData)
            setFilteredPeopleData(data.faceRecognitionData);
            timelineRef.current?.setTime(0);
            timelineRef.current?.setScrollLeft(0);
            setSpinMetadata(false)
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
      }
    },[currentEvidenceId])

    // const [noteStartTime, setNoteStartTime] = useState<Dayjs | null>(null);
    // const [noteEndTime, setNoteEndTime] = useState<Dayjs | null>(null);
    const [note, setNote] = useState()
    // const [startTime, setStartTime] = useState<string>()
    // const [endTime, setEndTime] = useState<string>()
    const [noteTimeRange, setNoteTimeRange] = useState<any>()
    const [level, setLevel] = useState<number>(1)
    const sendNote = () => {
      // console.log(startTime, endTime, note, currentId, noteStartTime, noteEndTime)
      fetch(url + '/api/Case/AddRelationCaseEvidenceNote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // relationId: currentId,
        caseId: caseId,
        evidenceId: currentEvidenceId,
        creatorUserId: (useUserStore.getState() as UserStoreState).userID,
        // startTime: startTime,
        // endTime: endTime,
        // notes: note,
        // createdAt: new Date().toISOString(),
        startTime: noteDetails.start,
        endTime: noteDetails.end,
        notes: note,
        level: level
      })
  })
  .then((response) => {
      if (response.ok) {
          // setLoading(false);
          setReloadNote(true);
          // setOpenAddNoteModal(false)
          return response.json();
      }
      else {
          throw new Error("Something went wrong");
      }
  })
  .then((data) => {
      console.log(data);
      // useCreateCaseStore.setState({data: data});
      success("Successfully added note!")
      setNoteDetailsModal(false)
      // navigate("/analyzeCase")
      console.log('success')
  })
  .catch((error) => {
      console.log(error);
  })
    }

    // const [value, setValue] = useState<Dayjs | null>(null);

  // const handleStartTime = (time: Dayjs) => {
  //   setNoteStartTime(time)
  //   // const seconds = new Date(time).getSeconds()
  //   // const minutes = new Date(time).getMinutes()
  //   // const hours = new Date(time).getHours()
  //   // seek(hours*3600 + minutes*60 + seconds)
  //   // setStartTime(hours*3600 + minutes*60 + seconds)
  // // console.log(time.toISOString())
  //   setStartTime(time.toISOString())
  // };

  // const handleEndTime = (time: Dayjs) => {
  //   setNoteEndTime(time);
  //   // const seconds = new Date(time).getSeconds()
  //   // const minutes = new Date(time).getMinutes()
  //   // const hours = new Date(time).getHours()
  //   // seek(hours*3600 + minutes*60 + seconds)
  //   // setEndTime(hours*3600 + minutes*60 + seconds)
  //   setEndTime(time.toISOString())
  // };

  const handleNote = (e: any) => {
    setNote(e.target.value)
  }

  const handleLevel = (e: any) => {
    setLevel(e)
  }

  const [notes, setNotes] = useState([])

  const handleTimeRange = (e: any) => {
    console.log(e)
    setNoteTimeRange(e)
    // setStartTime(e[0].toISOString())
    // setEndTime(e[1].toISOString())
  }

  useEffect(() => {
    if(noteTimeRange) {
      // setStartTime(noteTimeRange[0].toISOString())
      // setEndTime(noteTimeRange[1].toISOString())
    }
  },[noteTimeRange])

  const [spinNotes, setSpinNotes] = useState(false)

  useEffect(() => {
    setSpinNotes(true)
    if (currentEvidenceId !== undefined) {
    fetch (url + '/api/Case/GetRelationCaseEvidenceNote?caseId=' + caseId + '&evidenceId=' + currentEvidenceId, {
        method: 'GET'
    }).then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else {
            setReloadNote(false)
            return response.json()
        }
    })
    .then((data) => {
        console.log(data)
        const transformedData = data.map((item: any) => {
            const startTimeHours = new Date(item.startTime).getUTCHours();
            const startTimeMinutes = new Date(item.startTime).getUTCMinutes();
            const startTimeSeconds = new Date(item.startTime).getUTCSeconds();
            
            const endTimeHours = new Date(item.endTime).getUTCHours();
            const endTimeMinutes = new Date(item.endTime).getUTCMinutes();
            const endTimeSeconds = new Date(item.endTime).getUTCSeconds();
            return {
                ...item,
                startTime: new Date(item.startTime).toLocaleTimeString('en-GB', { timeZone: 'UTC' }),
                endTime: new Date(item.endTime).toLocaleTimeString('en-GB', { timeZone: 'UTC' }),
                startTimeTimeStamp: startTimeHours * 3600 + startTimeMinutes * 60 + startTimeSeconds,
                endTimeTimeStamp: endTimeHours * 3600 + endTimeMinutes * 60 + endTimeSeconds,
            }
        })
        // const filteredData = transformedData.filter((item: any) => item.relationCaseEvidenceId == currentId);
        setNotes(transformedData)
        setSpinNotes(false)
        console.log(transformedData)
        // setPeopleAttribute(data.peopleAttribute)
        // setFaceData(data.faceData)
        // setAttributePhotos(data.attributePhotos)
        // console.log(data.attributePhotos)
    })
    .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
    })
  }
}, [currentId, reloadNote, currentEvidenceId, caseId])

const [openAddNoteModal, setOpenAddNoteModal] = useState(false);
// const [noteStartTime,]

// const showModal = () => {
//   setOpenAddNoteModal(true);
// };

// const handleOk = () => {
//   setOpenAddNoteModal(false);
// };

const handleCancel = () => {
  setOpenAddNoteModal(false);
};

const [noteDetailsModal, setNoteDetailsModal] = useState(false)
const [noteDetails, setNoteDetails] = useState<any>()

const handleCancelNoteDetails = () => {
  setNoteDetailsModal(false);
};

const openNoteDetails = (action: any) => {
  setNoteDetails(action)
  setNoteDetailsModal(true)
}

const [filteredFaceData, setFilteredFaceData] = useState<FaceDataType[]>()
const [filteredAttributeData, setFilteredAttributeData] = useState<PeopleAttributeType[]>()

useEffect(() => {
  if (noteDetails) {
    setFilteredFaceData(faceData.filter((item: any) => item.timeStamp > noteDetails.start*1000 && item.timeStamp < noteDetails.end*1000))
    setFilteredAttributeData(peopleAttribute.filter((item: any) => item.startTime > noteDetails.start*1000 && item.startTime < noteDetails.end*1000))
  }
}, [noteDetails, faceData, peopleAttribute])

const [openAddTagModal, setOpenAddTagModal] = useState(false)
const [newTag, setNewTag] = useState<string>()
const [tags, setTags] = useState<any[]>([])
const [reloadTagList, setReloadTagList] = useState(false)

const handleNewTag = (e: any) => {
  setNewTag(e.target.value)
}
const addNewTag = () => {
  fetch (url + '/api/Case/tag/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      creatorUserId: (useUserStore.getState() as UserStoreState).userID,
      tagName: newTag,
      caseId: caseId
    })
  })
  .then((response) => {
    if (response.ok) {
        setNewTag(undefined)
        setOpenAddTagModal(false)
        success("Successfully added tag!")
        setReloadTagList(true)
        return response.json();
    }
    else {
        throw new Error("Something went wrong");
    }
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  })
}

useEffect(() => {
  fetch(url + '/api/Case/tag/list?caseId=' + caseId, {
    method: 'GET',
  })
  .then((response) => {
    if (response.ok) {
        // setNewTag(undefined)
        // setOpenAddTagModal(false)
        // success("Successfully added tag!")
        // return response.json();
    }
    else {
        throw new Error("Something went wrong");
    }
    return response.json()
  })
  .then((data) => {
    console.log(data);
    setTags(data)
    setReloadTagList(false)
  })
  .catch((error) => {
    console.log(error);
  })
},[reloadTagList])

const handleCloseTag = (tagId: string) => {
  fetch(url + '/api/Case/tag/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      creatorUserId: (useUserStore.getState() as UserStoreState).userID,
      tagId: tagId,
      caseId: caseId
    })
  })
  .then((response) => {
    if (response.ok) {
        success("Successfully deleted tag!")
        return response.json();
    }
    else {
        throw new Error("Something went wrong");
    }
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.log(error);
  })
}

const [activityLog, setActivityLog] = useState([])
const [spinActivity, setSpinActivity] = useState(false)

useEffect(() =>{
  setSpinActivity(true)
  fetch(url + '/api/Case/activity/list?caseId=' + caseId, {
    method: 'GET',
  })
  .then((response) => {
    if (response.ok) {
        // setNewTag(undefined)
        // setOpenAddTagModal(false)
        // success("Successfully added tag!")
        // return response.json();
    }
    else {
        throw new Error("Something went wrong");
    }
    return response.json()
  })
  .then((data) => {
    console.log(data);
    setActivityLog(data);
    setSpinActivity(false)
  })
  .catch((error) => {
    console.log(error);
  })
},[reloadTagList, reloadNote])

const updateStatus = (evidenceId: string, status: string) => {
  // let updatedStatus: string = '';

  // success(status)

  // if (status == "LINKED") {
  //   updatedStatus = "UNLINKED"
  // } else {
  //   updatedStatus = "LINKED"
  // }

  fetch(url + '/api/Case/UpdateCaseEvidenceRelationStatus', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    // relationId: relationId,
    caseId: caseId,
    evidenceId: evidenceId,
    userId: (useUserStore.getState() as UserStoreState).userID,
    status: status
  })
})
.then((response) => {
  if (response.ok) {
    setReloadTagList(true);
    setReloadEvidenceList(true);
    success("Successfully updated evidence!")
    getEvidenceList();
    // getNewEvidenceList();
    getFilteredEvidence();
      // return response.json();
  }
  else {
      throw new Error("Something went wrong");
  }
})
.then((data) => {
  console.log(data);
  // useCreateCaseStore.setState({data: data});
  
  // navigate("/analyzeCase")
  // console.log('success')
})
.catch((error) => {
  console.log(error);
})
}

const [openCloseCaseModal, setOpenCloseCaseModal] = useState(false);
const closeCase = () => {
  fetch (url + '/api/Case/CloseCase', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      caseId: caseId,
      creatorUserId: (useUserStore.getState() as UserStoreState).userID,
      reason: closeCaseReason
    })
  })
  .then((response) => {
    if (response.ok) {
      success("Successfully Closed Case")
      navigate('/case')
    }
    else {
        throw new Error("Something went wrong");
    }
  })
  // .then((data) => {
  //   console.log(data);
  // })
  .catch((error) => {
    console.log(error);
  })
}

const [openFilterModal, setOpenFilterModal] = useState(false)
const [appliedFilter, setAppliedFilter] = useState<any>()
const [filteredPeopleAttribute, setFilteredPeopleAttribute] = useState<any>(peopleAttribute)
const [filteredPeopleData, setFilteredPeopleData] = useState<any>(faceData)

const [selectedGeneralAttribute, setSelectedGeneralAttribute] = useState<any>([])
const [selectedColorAttribute, setSelectedColorAttribute] = useState<any>([])
const [selectedFaceData, setSelectedFaceData] = useState<any>()
// const [evidenceUrl, setEvidenceUrl] = useState('')
const [filterUrl, setFilterUrl] = useState('')
const [startTime, setStartTime] = useState<number>(0)
const [endTime, setEndTime] = useState<number>(0)
const [selectedTagId, setSelectedTagId] = useState<any>([])

useEffect(() =>{
  getEvidenceList()
  getFilteredEvidence()
}, [reloadEvidenceList, filterUrl])

const updateUrl = () => {
  // if (selectedFaceData.length !== 0) {
  //   setText('person='+ selectedFaceData)f
  //   console.log(selectedFaceData)
  // }
  let argument = ''
  if (startTime !== 0 && startTime !== undefined) {
    argument += '&startTime=' + startTime
  }
  if (endTime !== 0 && endTime !== undefined) {
    argument += '&endTime=' + endTime
  }
  if (selectedFaceData !== 0 && selectedFaceData !== undefined) {
    for (const item of selectedFaceData) {
      argument += '&personNumber=' + item
    }
  }
  if (selectedGeneralAttribute !== 0 && selectedGeneralAttribute !== undefined) {
    for (const item of selectedGeneralAttribute) {
      argument += '&generalAttribute=' + item
    }
  }
  if (selectedColorAttribute !== 0 && selectedColorAttribute !== undefined) {
    for (const item of selectedColorAttribute) {
      argument += '&colorAttribute=' + item
    }
  }
  if (selectedTagId !== 0 && selectedTagId !== undefined) {
    for (const item of selectedTagId) {
      argument += '&tagId=' + item
    }
  }
  console.log(argument)
  setFilterUrl(argument)
}

const userId = (useUserStore.getState() as UserStoreState).userID

// useEffect(() => {
//   setEvidenceUrl(url + '/api/Evidence/case/filter?caseId=' + caseId + '&userId' + userId)
// }, [])

// useEffect(() => {
//   console.log(evidenceUrl)
// }, [evidenceUrl])

const applyFilter = () => {
  setAppliedFilter(selectedGeneralAttribute.concat(selectedColorAttribute))
  // setAppliedFaceFilter(selectedFaceData)
  setOpenFilterModal(false)
  console.log(selectedGeneralAttribute)
  console.log(filteredPeopleAttribute)
  console.log(selectedFaceData)
  console.log(appliedFilter)
  updateUrl()
}

useEffect(() => {
if (appliedFilter) {
  setFilteredPeopleAttribute(
    peopleAttribute.filter((item: any) =>
        appliedFilter.every((filterKey: string) => Object.prototype.hasOwnProperty.call(item.attribute, filterKey) && item.attribute[filterKey] >= 0.5)
      )
  )
}
}, [peopleAttribute, appliedFilter])

useEffect(() => {
  if (selectedFaceData) {
    if (selectedFaceData.length != 0) {
      setFilteredPeopleData(
        faceData.filter((item: any) =>
            selectedFaceData.some((person: any) => person == item.personNumber )
          )
      )
    }
    else {
        setFilteredPeopleData(faceData)
      }
  }
  // else {
  //   setFilteredPeopleData(faceData)
  // }
  }, [faceData, selectedFaceData])

// const [taggedEvidenceList, setTaggedEvidenceList] = useState()

// useEffect(() => {
//   evidenceList.map((data) => {
//     setTaggedEvidenceList({
//       evidence
//     })
//   })
// }, [evidenceList])

const [closeCaseReason, setCloseCaseReason] = useState<string>()

const handleCloseCaseReason = (e: any) => {
  setCloseCaseReason(e.target.value)
}

const [openCollaboratorModal, setOpenCollaboratorModal] = useState(false)
// const [openAddCollaboratorModal, setOpenAddCollaboratorModal] = useState(false)
const [newCollaboratorList, setNewCollaboratorList] = useState([])
useEffect(() => {
  fetch(url + '/api/Case/collaborator/list?caseId=' + caseId + '&userId=' + (useUserStore.getState() as UserStoreState).userID, {
    method: 'GET',
  }).then((response) => {
    if (response.ok) {
        // setNewTag(undefined)
        // setOpenAddTagModal(false)
        // success("Successfully added tag!")
        return response.json();
    }
    else {
        throw new Error("Something went wrong");
    }
  }
  )
  .then((data) => {
    console.log(data);
    setNewCollaboratorList(data.map((a: any) => ({
      // key: a.userId,
      value: a.userId,
      label: a.name
      })));
  }).catch((error) => {
    console.log(error);
  })
}, [])

const [newCollaborator, setNewCollaborator] = useState()

const handleNewCollaborator = (e: any) => {
  setNewCollaborator(e)
}

const handleAddNewCollaborator = () => {
  fetch(url + '/api/Case/collaborator/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        caseId: caseId,
        creatorUserId: (useUserStore.getState() as UserStoreState).userID,
        collaboratorUserId: newCollaborator
      })
  }).then((response) => {
    if (response.ok) {
      success("Successfully added collaborator!")
      // return response.json();
    }
    else {
        throw new Error("Something went wrong");
    }
  }
  )
  .then((data) => {
    console.log(data);
    // setReloadTagList(true)
  }).catch((error) => {
    console.log(error);
  })
  
}

const [openInfoModal, setOpenInfoModal] = useState(false)

const [caseTitle, setCaseTitle] = useState('')
const [objective, setObjective] = useState('')
const [executiveSummary, setExecutiveSummary] = useState('')
const [conclusion, setConclusion] = useState('')

useEffect(() => {
  setObjective(currentCaseData?.objective)
  setCaseTitle(currentCaseData?.title)
  setExecutiveSummary(currentCaseData?.executiveSummary)
  setConclusion(currentCaseData?.conclusion)
}, [currentCaseData])

const updateCaseTitle = (e: any) => {
  setCaseTitle(e.target.value)
}

const updateObjective = (e: any) => {
  setObjective(e.target.value)
}

const updateExecutiveSummary = (e: any) => {
  setExecutiveSummary(e.target.value)
}

const updateConclusion = (e: any) => {
  setConclusion(e.target.value)
}

const updateCase = () => {
  fetch (url + '/api/Case/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
   creatorUserId: (useUserStore.getState() as UserStoreState).userID,
   title: caseTitle,
   objective: objective,
   executiveSummary: executiveSummary,
   conclusion: conclusion,
   caseId: caseId
  })
})
.then((response) => {
  if (response.ok) {
      // return response.json();
  }
  else {
      throw new Error("Something went wrong");
  }
})
.then((data) => {
  console.log(data);
  setOpenInfoModal(false)
  success("Successfully updated case")
})
.catch((error) => {
  console.log(error);
})
}

// const resetFilter = () => {
//   setStartTime(0)
//   setEndTime(0)
//   setSelectedTagId([])
//   setSelectedFaceData([])
//   setSelectedGeneralAttribute([])
//   setSelectedColorAttribute([])
// }

const [resetFilter, setResetFilter] = useState(false)

    return (
        <Layout style={{height: '100%', background: 'none'}}>
          <Layout style={{height: '100%', background: 'none'}}>
            {/* <Layout style={{background: 'purple', width: '30%'}}></Layout>
            <Layout style={{background: 'green', width: '70%'}}></Layout> */}
            <Row gutter={[10, 10]} style={{height: '100%'}}>
              <Col span={12} style={{height: '100%'}}>
                <Title style={{marginTop: 0}} level={3}>{currentCaseData?.title} <InfoCircleOutlined onClick={() => setOpenInfoModal(true)} /></Title>
                <Row justify="space-between" style={{paddingBottom: '10px'}}>
                  <Col>
                    <Text>Status: {currentCaseData?.status}</Text>
                  </Col>
                  <Col>
                    <Space align="end">
                      <Text>{currentCaseData?.creator} - </Text>
                      <Text>{new Date(currentCaseData?.createdAt).toLocaleString('en-GB', { timeZone: 'Asia/Jakarta' })}</Text>
                    </Space>
                  </Col>
                </Row>
                <Space direction="vertical" style={{width: '100%'}}>
                  {/* <Row gutter={[10, 10]}> */}
                  <Space.Compact style={{width: '100%', overflow: 'auto'}}>
                    {tags?.map((tag) => (
                      <Tag closable={true} onClose={() => handleCloseTag(tag.tagId)}>{tag.name}</Tag>
                    ))}
                  </Space.Compact>
                  {/* </Row> */}
                  <Row justify="space-between" style={{marginBottom: '10px'}}>
                    <Col>
                      <Space>
                        {openAddTagModal && 
                        <>
                          <Input placeholder="Enter tag name" value={newTag} onChange={handleNewTag} /><Button onClick={addNewTag}>Add</Button>
                        </>}
                        <Button onClick={() => setOpenAddTagModal(!openAddTagModal)}>
                          {!openAddTagModal && <Text>Add Tag</Text>}
                          {openAddTagModal && <Text>Cancel</Text>}
                        </Button>
                      </Space>
                    </Col>
                    <Col>
                      <Space>
                        <Button onClick={() => setOpenCollaboratorModal(true)}>Collaborator</Button>
                        <Button onClick={() => setOpenFilterModal(true)}>Filter</Button>
                        <Button type="primary" onClick={() => setOpenCloseCaseModal(true)}>Close Case</Button>
                        <Button type="primary" onClick={() => navigate('/report/' + caseId)}>Report</Button>
                      </Space>
                    </Col>
                  </Row>
                </Space>
                <Space direction="vertical"  style={{height: '400px', width: '100%', overflowY: 'auto', overflowX: 'hidden'}}>
                <Row gutter={10}>
                  {/* <Col span={12}>
                    <Divider orientation="left" orientationMargin={10} style={{margin: '8px 0'}}>New Evidence</Divider>
                    <NewEvidenceList data={newEvidenceList} currentEvidenceId={currentEvidenceId} setCurrentEvidenceId={setCurrentEvidenceId} setCurrentId={setCurrentId} updateStatus={updateStatus} />
                  </Col> */}
                  <Col span={24}>
                    <Divider orientation="left" orientationMargin={10} style={{margin: '8px 0'}}><Spin spinning={spinEvidenceList} /> Evidence List ({evidenceList?.length})</Divider>
                    {(newEvidenceList.length != 0) && <NewEvidenceList data={newEvidenceList} currentEvidenceId={currentEvidenceId} setCurrentEvidenceId={setCurrentEvidenceId} setCurrentId={setCurrentId} updateStatus={updateStatus} />}
                    {/* <NewEvidenceList data={newEvidenceList} currentEvidenceId={currentEvidenceId} setCurrentEvidenceId={setCurrentEvidenceId} setCurrentId={setCurrentId} updateStatus={updateStatus} /> */}
                    <EvidenceList data={evidenceList} currentEvidenceId={currentEvidenceId} setCurrentEvidenceId={setCurrentEvidenceId} setCurrentId={setCurrentId} updateStatus={updateStatus} success={success} />
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col span={12}>
                    <Divider orientation="left" orientationMargin={10} style={{margin: '8px 0'}}><Spin spinning={spinMetadata} /> People Metadata ({filteredPeopleData?.length})</Divider>
                    <Layout style={{height: '200px', overflowY: 'auto', background: 'none'}}>
                      <FaceList seek={seek} faceData={filteredPeopleData} />
                    </Layout>
                  </Col>
                  <Col span={12}>
                    <Divider orientation="left" orientationMargin={10} style={{margin: '8px 0'}}><Spin spinning={spinMetadata} /> Attribute Metadata ({filteredPeopleAttribute?.length})</Divider>
                    <Layout style={{height: '200px', overflowY: 'auto', background: 'none'}}>
                      <AttributeList seek={seek} peopleAttribute={filteredPeopleAttribute} />
                    </Layout>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                      <Row gutter= {10}>
                        <Col flex="auto">
                        <Divider orientation="left" orientationMargin={10} style={{margin: '8px 0'}}><Spin spinning={spinNotes} /> Notes</Divider>
                        </Col>
                        {/* <Col flex="none">
                        <Space style={{height: '100%'}}>
                          <Button type="primary" style={{width: '100%', margin: 'auto'}}>Add Note</Button>
                        </Space>
                        </Col> */}
                      </Row>
                      <Notes notes={notes} seek={seek} />
                    </Col>
                    <Col span={24}>
                      <Divider orientation="left" orientationMargin={10} style={{margin: '8px 0'}}><Spin spinning={spinActivity} /> Activity Log</Divider>
                      <ActivityLog activityLog={activityLog} />
                    </Col>
                </Row>
                </Space>
              </Col>
              <Col span={12} flex="none">
                {/* <ReactPlayer url={videoUrl} height="350px" controls={true} /> */}
                <CaseTimeline 
                  videoUrl={videoUrl} 
                  reactPlayerRef={ref} 
                  timelineRef={timelineRef} 
                  isPlaying={isPlaying} 
                  setIsPlaying={setIsPlaying} 
                  faceData={faceData} 
                  attributeData={peopleAttribute} 
                  notes={notes} 
                  setOpenAddNoteModal={setOpenAddNoteModal} 
                  setNoteTimeRange={setNoteTimeRange} 
                  openNoteDetails={openNoteDetails} 
                  handleStop={handleStop}
                  setNoteDetailsModal={setNoteDetailsModal} />
                {/* <Space direction="vertical" style={{width: '100%', padding: '10px 0'}}>
                  <Row gutter={10}>
                    <Col span={12}>
                      <TimePicker style={{width: '100%'}} value={noteStartTime} onChange={handleStartTime} placeholder="Start time" />
                    </Col>
                    <Col span={12}>
                      <TimePicker style={{width: '100%'}} value={noteEndTime} onChange={handleEndTime} />
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col flex="auto">
                      <Input  style={{width: '100%'}} value={note} onChange={handleNote} />
                    </Col>
                    <Col flex="none">
                      <Button onClick={sendNote}>Send</Button>
                    </Col>
                  </Row>
                </Space> */}
              </Col>
            </Row>
            <Modal title="Add Note" open={openAddNoteModal} onOk={sendNote} okText="Add Note" onCancel={handleCancel}>
              <Space direction="vertical" style={{width: '100%', padding: '10px 0'}}>
                <Text>Time Range</Text>
                <TimePicker.RangePicker value={noteTimeRange} onChange={handleTimeRange} style={{width: '100%'}} />
                <Text>Priority Level</Text>
                <Select
                  defaultValue="1"
                  style={{width: '100%'}}
                  options={[
                    { value: '1', label: '1' },
                    { value: '2', label: '2' },
                    { value: '3', label: '3' },
                    { value: '4', label: '4' },
                  ]}
                />
                <Text>Note</Text>
                <Input  style={{width: '100%'}} value={note} onChange={handleNote} />
              </Space>
            </Modal>
            <Modal title="Note Details" open={noteDetailsModal} onOk={sendNote} okText="Add Note" onCancel={handleCancelNoteDetails} footer={false}>
              <Space direction="vertical" style={{width: '100%', padding: '10px 0'}}>
                {noteDetails && noteDetails.data.saved &&
                  <Space direction="vertical">
                    <Text>Start Time: {new Date(dayjs.unix(noteDetails.start).toString()).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
                    <Text>End Time: {new Date(dayjs.unix(noteDetails.end).toString()).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
                    {/* <Text>Status: {noteDetails.data.status ? 'Saved' : 'Not Saved'}</Text> */}
                    <Text>Note: {noteDetails.data.name}</Text>
                    <Text>Level: {noteDetails.data.level}</Text>
                    <Text>Description: {noteDetails.data.notes}</Text>
                  </Space>
                }
                {
                  noteDetails && !noteDetails.data.saved && 
                  <Space direction="vertical" style={{width: '100%'}}>
                    <Row>
                      <Col span={6}>
                        <Text>Start Time</Text>
                      </Col>
                      <Col>
                        <Text>{new Date(dayjs.unix(noteDetails.start).toString()).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <Text>End Time</Text>
                      </Col>
                      <Col>
                        <Text>{new Date(dayjs.unix(noteDetails.end).toString()).toLocaleTimeString('en-GB', { timeZone: 'UTC' })}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        Title
                      </Col>
                      <Col>
                        {noteDetails.data.name}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        Level
                      </Col>
                      <Col span={18}>
                      <Select defaultValue='1' style={{width: '100%'}} onChange={handleLevel} options={
                        [{label: '1', value: 1},
                        {label: '2', value: 2},
                        {label: '3', value: 3}]
                        } />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        Note
                      </Col>
                      <Col span={18}>
                        <TextArea value={note} onChange={handleNote} />
                      </Col>
                    </Row>
                    <Row justify="end">
                      <Col>
                        <Button type="primary" onClick={sendNote}>Save Note</Button>
                      </Col>
                    </Row>
                    {/* <Text>Title: {noteDetails.data.name}</Text> */}
                    {/* <Input value={note} onChange={handleNote} />
                    <Button onClick={sendNote}>Save Note</Button> */}
                  </Space>
                }
                <Divider>People Metadata</Divider>
                {filteredFaceData && <FaceList seek={seek} faceData={filteredFaceData} />}
                <Divider>Attibute Metadata</Divider>
                {filteredAttributeData && <AttributeList seek={seek} peopleAttribute={filteredAttributeData}/>}
              </Space>
            </Modal>
            <Modal title="Close Case" open={openCloseCaseModal} onOk={closeCase} okText="Close Case" onCancel={() => setOpenCloseCaseModal(false)}>
              <Space direction="vertical" style={{width: '100%'}}>
                <Text>Reason to close case</Text>
                <TextArea placeholder="Enter your reason" value={closeCaseReason} onChange={handleCloseCaseReason} />
              </Space>
            </Modal>
            <Modal centered title="Filter" open={openFilterModal} onOk={applyFilter} okText="Apply" onCancel={() => setOpenFilterModal(false)}
            width={700}
            footer={[
              <Button onClick={() => setOpenFilterModal(false)}>
                Cancel
              </Button>,
              <Button onClick={() => setResetFilter(true)}>
                Reset
              </Button>,
              <Button
                type="primary"
                onClick={applyFilter}
              >
                Apply
              </Button>,
            ]}>
              {/* <Row>
                <Col span={4}>
                  <Text>Person</Text>
                </Col>
                <Col span={20}>
                  <Select style={{width: '100%'}} />
                </Col>
              </Row>
              <Row>
                <Col span={4}>
                  <Text>Age</Text>
                </Col>
                <Col span={20}>
                  <Select style={{width: '100%'}} />
                </Col>
              </Row> */}
              <Filter selectedGeneralAttribute={selectedGeneralAttribute} setSelectedGeneralAttribute={setSelectedGeneralAttribute} selectedFaceData={selectedFaceData} setSelectedFaceData={setSelectedFaceData} selectedColorAttribute={selectedColorAttribute} setSelectedColorAttribute={setSelectedColorAttribute} startTime={startTime} setStartTime={setStartTime} endTime={endTime} setEndTime={setEndTime} selectedTagId={selectedTagId} setSelectedTagId={setSelectedTagId} resetFilter={resetFilter} setResetFilter={setResetFilter} currentCaseData={currentCaseData} />
            </Modal>
            <Modal centered title="Collaborator" open={openCollaboratorModal} onOk={applyFilter} okText="Add Collaborator" onCancel={() => setOpenCollaboratorModal(false)} footer={false}>
              <Space direction="vertical" style={{width: '100%'}}>
              {currentCaseData?.collaborators.map((collaborator: string) => <Text>{collaborator}</Text>)}
              <Select options={newCollaboratorList} style={{width: '100%'}} placeholder="Add Collaborator" onChange={handleNewCollaborator} />
              <Button type="primary" onClick={handleAddNewCollaborator}>Add</Button>
              </Space>
            </Modal>
            {/* <Modal centered title="Add Collaborator" open={openAddCollaboratorModal} onOk={() => setOpenAddCollaboratorModal(true)} okText="Add" onCancel={() => setOpenAddCollaboratorModal(false)}>
              
            </Modal> */}
            <Modal centered title="Case Information" open={openInfoModal} onOk={updateCase} okText="Update" onCancel={() => setOpenInfoModal(false)} width={1000}>
              {/* <Filter /> */}
              <Row>
                <Col span={12}>
                  <Space direction="vertical" style={{width: '100%', maxHeight: '400px', overflowY: 'scroll'}}>
                    <Text>Person</Text>
                    {personBaseFilter.map((person: any) => 
                      <Space direction="horizontal" style={{width: '100%'}}>
                        {/* <img src={"data:image/png;base64," + person.picture}  style={{height: '100px'}} /> */}
                        <Avatar src={"data:image/png;base64," + person.picture} />
                        <Text>{person.name}</Text>
                      </Space>
                    )}
                    <Row>
                      <Col span={8}>
                        <Text>Gender</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.gender}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Age</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.age}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Hair Length</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.hairLength}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Upper Clothes Length</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.upperClothesLength}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Lower Clothes Length</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.lowerClothesLength}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Lower Clothes Type</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.lowerClothesType}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Accessories</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.accessories}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Upper Clothes Color</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.upperClothesColor}</Text>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={8}>
                        <Text>Lower Clothes Color</Text>
                      </Col>
                      <Col span={16}>
                        <Text>: {currentCaseData?.attributeBaseFilter.lowerClothesColor}</Text>
                      </Col>
                    </Row>
                  </Space>
                </Col>
                <Col span={12}>
                <Space direction="vertical" style={{width: '100%'}}>
                  <Text>Case Title</Text>
                  <Input placeholder="Enter case title" value={caseTitle} onChange={updateCaseTitle} />
                  <Text>Objective</Text>
                  <TextArea placeholder="Enter objective" value={objective} onChange={updateObjective} />
                  <Text>Executive Summary</Text>
                  <TextArea placeholder="Enter executive summary" value={executiveSummary} onChange={updateExecutiveSummary} />
                  <Text>Conclusion</Text>
                  <TextArea placeholder="Enter conclusion" value={conclusion} onChange={updateConclusion} />
                </Space>
                </Col>
              </Row>
            </Modal>

          </Layout>
          {/* <Layout style={{background: 'none', height: '100%'}}>
            <Row gutter={10} style={{height: '100%'}}>
              <Col span={6}>
                <Divider orientation="left" orientationMargin={0} style={{margin: '8px 0'}}>Activity Log</Divider>
                <ActivityLog />
              </Col>
              <Col span={6}>
                <Divider orientation="left" orientationMargin={0} style={{margin: '8px 0'}}>People Metadata</Divider>
                <Layout style={{height: '150px', overflowY: 'auto', background: 'none'}}>
                  <FaceList seek={seek} faceData={faceData} />
                </Layout>
              </Col>
              <Col span={6}>
                <Divider orientation="left" orientationMargin={0} style={{margin: '8px 0'}}>Attribute Metadata</Divider>
                <Layout style={{height: '150px', overflowY: 'auto', background: 'none'}}>
                  <AttributeList seek={seek} peopleAttribute={peopleAttribute} attributePhotos={attributePhotos} />
                </Layout>
              </Col>
              <Col span={6}>
                <Row gutter= {10}>
                  <Col flex="auto">
                  <Divider orientation="left" orientationMargin={0} style={{margin: '8px 0'}}>Notes</Divider>
                  </Col>
                  <Col flex="none">
                  <Space style={{height: '100%'}}>
                    <Button type="primary" style={{width: '100%', margin: 'auto'}}>Add Note</Button>
                  </Space>
                  </Col>
                </Row>
                <Notes />
              </Col>
            </Row>
          </Layout> */}
        </Layout>
    )
}

export default AnalyzeCase;
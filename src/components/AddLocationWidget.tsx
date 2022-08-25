import React, { useEffect } from 'react'
import { locateOutline } from 'ionicons/icons'
import {
  IonIcon,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonList,
  IonItemDivider,
} from '@ionic/react'
import './AddLocationWidget.scss'

interface AddLocationWidgetProps {
  show: boolean
}

const AddLocationWidget: React.FC<AddLocationWidgetProps> = ({ show }) => {
  return (
    <div>
      <div className={`locate-indicator ${show ? '' : 'hide'}`}>
        <IonIcon icon={locateOutline} />
      </div>

      <div
        className={show ? 'add-locate-widget show' : 'add-locate-widget hide'}
      >
        <div>
          <IonList className="location-list">
            <IonItemDivider>Location List</IonItemDivider>
            <IonItem>
              <IonLabel>Longitude:</IonLabel>
              <IonInput></IonInput>

              <IonLabel>Latitude:</IonLabel>
              <IonInput></IonInput>
              <IonButton color="secondary">Show</IonButton>
            </IonItem>
            <IonItem>
              <IonLabel>Longitude:</IonLabel>
              <IonInput></IonInput>

              <IonLabel>Latitude:</IonLabel>
              <IonInput></IonInput>
              <IonButton color="tertiary">Show</IonButton>
            </IonItem>
          </IonList>
          <IonItemDivider>Add Location</IonItemDivider>
          <IonItem>
            <IonLabel>Longitude:</IonLabel>
            <IonInput></IonInput>

            <IonLabel>Latitude:</IonLabel>
            <IonInput></IonInput>
            <IonButton color="primary">Add</IonButton>
          </IonItem>
        </div>
      </div>
    </div>
  )
}
export default AddLocationWidget

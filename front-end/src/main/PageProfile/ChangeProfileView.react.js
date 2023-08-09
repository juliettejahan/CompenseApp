import React, { useState } from 'react';
import { View } from 'react-native';
import ChangeAccount from './ChangeAccount.react';
import { ALERT_TYPE, Dialog, AlertNotificationRoot } from 'react-native-alert-notification';

const TABS = Object.freeze({ LOGIN: 'LOGIN', CREATE_ACCOUNT: 'CHANGE_ACCOUNT' });

/**
 * View of changing personnal information page
 */
export default function ChangeProfileView() {
  const [tab, setTab] = useState(TABS.LOGIN);


  const show_notif = () => Dialog.show({
    type: ALERT_TYPE.SUCCESS,
    title: 'Bravo !',
    textBody: 'Changement de profil réussi',
    button: 'Fermer',
  });

  return (
    <AlertNotificationRoot>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ChangeAccount onSuccess={() => show_notif()} onCancel={() => setTab(TABS.LOGIN)} />
      </View>
    </AlertNotificationRoot>
  );
}

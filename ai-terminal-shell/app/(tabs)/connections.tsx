import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Server, Plus, CreditCard as Edit3, Trash2, Wifi, WifiOff, Key, Clock, Activity, Shield, Globe, Terminal } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

interface SSHConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  username: string;
  keyFile?: string;
  lastConnected?: Date;
  status: 'connected' | 'disconnected' | 'connecting';
  connectionTime?: number; // in seconds
  description?: string;
}

const SAMPLE_CONNECTIONS: SSHConnection[] = [
  {
    id: '1',
    name: 'Production Server',
    host: '192.168.1.100',
    port: 22,
    username: 'admin',
    keyFile: 'id_rsa_prod',
    lastConnected: new Date('2024-01-15T10:30:00'),
    status: 'connected',
    connectionTime: 3600,
    description: 'Main production environment',
  },
  {
    id: '2',
    name: 'Development Server',
    host: 'dev.example.com',
    port: 2222,
    username: 'developer',
    keyFile: 'id_rsa_dev',
    lastConnected: new Date('2024-01-15T14:20:00'),
    status: 'disconnected',
    description: 'Development and testing environment',
  },
  {
    id: '3',
    name: 'Staging Environment',
    host: 'staging.example.com',
    port: 22,
    username: 'deploy',
    lastConnected: new Date('2024-01-14T16:45:00'),
    status: 'disconnected',
    description: 'Pre-production staging server',
  },
  {
    id: '4',
    name: 'Database Server',
    host: 'db.internal.com',
    port: 22,
    username: 'dbadmin',
    keyFile: 'id_rsa_db',
    lastConnected: new Date('2024-01-15T09:15:00'),
    status: 'connecting',
    description: 'Primary database server',
  },
];

export default function ConnectionsScreen() {
  const [connections, setConnections] = useState<SSHConnection[]>(SAMPLE_CONNECTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConnection, setEditingConnection] = useState<SSHConnection | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<SSHConnection | null>(null);
  const [newConnection, setNewConnection] = useState({
    name: '',
    host: '',
    port: '22',
    username: '',
    keyFile: '',
    description: '',
  });

  const connectToServer = (connection: SSHConnection) => {
    setConnections(prev =>
      prev.map(conn =>
        conn.id === connection.id
          ? { ...conn, status: 'connecting' as const }
          : conn
      )
    );

    // Simulate connection process
    setTimeout(() => {
      setConnections(prev =>
        prev.map(conn =>
          conn.id === connection.id
            ? {
                ...conn,
                status: 'connected' as const,
                lastConnected: new Date(),
                connectionTime: 0,
              }
            : conn
        )
      );
    }, 2000);
  };

  const disconnectFromServer = (connection: SSHConnection) => {
    setConnections(prev =>
      prev.map(conn =>
        conn.id === connection.id
          ? { ...conn, status: 'disconnected' as const, connectionTime: undefined }
          : conn
      )
    );
  };

  const deleteConnection = (connection: SSHConnection) => {
    Alert.alert(
      'Delete Connection',
      `Are you sure you want to delete "${connection.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setConnections(prev => prev.filter(conn => conn.id !== connection.id));
          },
        },
      ]
    );
  };

  const saveConnection = () => {
    if (!newConnection.name || !newConnection.host || !newConnection.username) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const connection: SSHConnection = {
      id: Date.now().toString(),
      name: newConnection.name,
      host: newConnection.host,
      port: parseInt(newConnection.port) || 22,
      username: newConnection.username,
      keyFile: newConnection.keyFile || undefined,
      description: newConnection.description || undefined,
      status: 'disconnected',
    };

    if (editingConnection) {
      setConnections(prev =>
        prev.map(conn =>
          conn.id === editingConnection.id ? { ...connection, id: editingConnection.id } : conn
        )
      );
    } else {
      setConnections(prev => [...prev, connection]);
    }

    resetForm();
  };

  const resetForm = () => {
    setNewConnection({
      name: '',
      host: '',
      port: '22',
      username: '',
      keyFile: '',
      description: '',
    });
    setShowAddModal(false);
    setEditingConnection(null);
  };

  const editConnection = (connection: SSHConnection) => {
    setNewConnection({
      name: connection.name,
      host: connection.host,
      port: connection.port.toString(),
      username: connection.username,
      keyFile: connection.keyFile || '',
      description: connection.description || '',
    });
    setEditingConnection(connection);
    setShowAddModal(true);
  };

  const getStatusIcon = (status: SSHConnection['status']) => {
    switch (status) {
      case 'connected':
        return <Wifi size={isTablet ? 20 : 16} color="#00FF00" />;
      case 'connecting':
        return <Activity size={isTablet ? 20 : 16} color="#FFD700" />;
      default:
        return <WifiOff size={isTablet ? 20 : 16} color="#666" />;
    }
  };

  const getStatusColor = (status: SSHConnection['status']) => {
    switch (status) {
      case 'connected':
        return '#00FF00';
      case 'connecting':
        return '#FFD700';
      default:
        return '#666';
    }
  };

  const formatConnectionTime = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const ConnectionCard = ({ connection }: { connection: SSHConnection }) => (
    <TouchableOpacity
      style={[
        styles.connectionCard,
        connection.status === 'connected' && styles.connectedCard,
        isTablet && styles.tabletCard,
      ]}
      onPress={() => setSelectedConnection(connection)}
    >
      <View style={styles.connectionHeader}>
        <View style={styles.connectionInfo}>
          <View style={styles.connectionTitleRow}>
            <Text style={styles.connectionName}>{connection.name}</Text>
            <View style={styles.connectionStatus}>
              {getStatusIcon(connection.status)}
              <Text style={[styles.statusText, { color: getStatusColor(connection.status) }]}>
                {connection.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.connectionDetails}>
            <Globe size={isTablet ? 16 : 14} color="#87CEEB" />
            <Text style={styles.connectionDetailsText}>
              {connection.username}@{connection.host}:{connection.port}
            </Text>
          </View>

          {connection.description && (
            <Text style={styles.connectionDescription}>{connection.description}</Text>
          )}

          {connection.keyFile && (
            <View style={styles.keyInfo}>
              <Key size={isTablet ? 14 : 12} color="#FFD700" />
              <Text style={styles.keyText}>{connection.keyFile}</Text>
            </View>
          )}

          <View style={styles.connectionMeta}>
            {connection.lastConnected && (
              <View style={styles.metaItem}>
                <Clock size={isTablet ? 14 : 12} color="#666" />
                <Text style={styles.metaText}>
                  {connection.lastConnected.toLocaleDateString()} at{' '}
                  {connection.lastConnected.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            )}
            
            {connection.status === 'connected' && connection.connectionTime !== undefined && (
              <View style={styles.metaItem}>
                <Activity size={isTablet ? 14 : 12} color="#00FF00" />
                <Text style={styles.metaText}>
                  Connected for {formatConnectionTime(connection.connectionTime)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.connectionActions}>
        {connection.status === 'connected' ? (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.terminalButton]}
              onPress={() => {/* Open terminal */}}
            >
              <Terminal size={isTablet ? 18 : 16} color="#87CEEB" />
              <Text style={styles.actionButtonText}>Terminal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.disconnectButton]}
              onPress={() => disconnectFromServer(connection)}
            >
              <Text style={styles.actionButtonText}>Disconnect</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.connectButton]}
            onPress={() => connectToServer(connection)}
            disabled={connection.status === 'connecting'}
          >
            <Text style={styles.actionButtonText}>
              {connection.status === 'connecting' ? 'Connecting...' : 'Connect'}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => editConnection(connection)}
        >
          <Edit3 size={isTablet ? 18 : 16} color="#87CEEB" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => deleteConnection(connection)}
        >
          <Trash2 size={isTablet ? 18 : 16} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Server size={isTablet ? 28 : 24} color="#00FF00" />
          <Text style={styles.headerTitle}>SSH Connections</Text>
          <View style={styles.connectionCount}>
            <Text style={styles.countText}>
              {connections.filter(c => c.status === 'connected').length}/{connections.length}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={isTablet ? 24 : 20} color="#00FF00" />
          {isTablet && <Text style={styles.addButtonText}>Add Connection</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.connectionsList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.connectionsContent}
      >
        {connections.map((connection) => (
          <ConnectionCard key={connection.id} connection={connection} />
        ))}
      </ScrollView>

      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={resetForm}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingConnection ? 'Edit Connection' : 'Add Connection'}
            </Text>
            <TouchableOpacity onPress={saveConnection}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Connection Name *</Text>
              <TextInput
                style={styles.input}
                value={newConnection.name}
                onChangeText={(text) => setNewConnection(prev => ({ ...prev, name: text }))}
                placeholder="Production Server"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Host Address *</Text>
              <TextInput
                style={styles.input}
                value={newConnection.host}
                onChangeText={(text) => setNewConnection(prev => ({ ...prev, host: text }))}
                placeholder="192.168.1.100 or server.example.com"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>Port</Text>
                <TextInput
                  style={styles.input}
                  value={newConnection.port}
                  onChangeText={(text) => setNewConnection(prev => ({ ...prev, port: text }))}
                  placeholder="22"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>

              <View style={[styles.formGroup, styles.formGroupHalf]}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  value={newConnection.username}
                  onChangeText={(text) => setNewConnection(prev => ({ ...prev, username: text }))}
                  placeholder="admin"
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>SSH Key File (Optional)</Text>
              <TextInput
                style={styles.input}
                value={newConnection.keyFile}
                onChangeText={(text) => setNewConnection(prev => ({ ...prev, keyFile: text }))}
                placeholder="id_rsa, id_ed25519"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newConnection.description}
                onChangeText={(text) => setNewConnection(prev => ({ ...prev, description: text }))}
                placeholder="Brief description of this server..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isTablet ? 20 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#111',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 22 : 18,
    color: '#FFF',
    marginLeft: 12,
  },
  connectionCount: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  countText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#00FF00',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isTablet ? 12 : 8,
    backgroundColor: '#1a4d1a',
    borderRadius: isTablet ? 12 : 8,
    gap: 8,
  },
  addButtonText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: 16,
    color: '#00FF00',
  },
  connectionsList: {
    flex: 1,
  },
  connectionsContent: {
    padding: isTablet ? 24 : 16,
    gap: isTablet ? 16 : 12,
  },
  connectionCard: {
    backgroundColor: '#111',
    borderRadius: isTablet ? 16 : 12,
    padding: isTablet ? 20 : 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  connectedCard: {
    borderColor: '#00FF00',
    backgroundColor: '#0a1a0a',
  },
  tabletCard: {
    minHeight: 180,
  },
  connectionHeader: {
    marginBottom: isTablet ? 16 : 12,
  },
  connectionInfo: {
    flex: 1,
  },
  connectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  connectionName: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 20 : 16,
    color: '#FFF',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    textTransform: 'capitalize',
  },
  connectionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  connectionDetailsText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#87CEEB',
  },
  connectionDescription: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#AAA',
    marginBottom: 8,
  },
  keyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  keyText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 14 : 12,
    color: '#FFD700',
  },
  connectionMeta: {
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 12 : 10,
    color: '#666',
  },
  connectionActions: {
    flexDirection: 'row',
    gap: isTablet ? 12 : 8,
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: isTablet ? 12 : 8,
    paddingHorizontal: isTablet ? 16 : 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectButton: {
    backgroundColor: '#1a4d1a',
    flex: 1,
  },
  disconnectButton: {
    backgroundColor: '#4d1a1a',
    flex: 1,
  },
  terminalButton: {
    backgroundColor: '#1a1a4d',
    flex: 1,
  },
  editButton: {
    backgroundColor: '#333',
  },
  deleteButton: {
    backgroundColor: '#4d1a1a',
  },
  actionButtonText: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isTablet ? 24 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#111',
  },
  modalTitle: {
    fontFamily: 'FiraCode-Bold',
    fontSize: isTablet ? 20 : 18,
    color: '#FFF',
  },
  cancelButton: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#FF6B6B',
  },
  saveButton: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#00FF00',
  },
  modalContent: {
    flex: 1,
    padding: isTablet ? 24 : 16,
  },
  formGroup: {
    marginBottom: isTablet ? 24 : 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: isTablet ? 16 : 12,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 16 : 14,
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'FiraCode-Regular',
    fontSize: isTablet ? 18 : 16,
    color: '#FFF',
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 20 : 16,
    backgroundColor: '#222',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    height: isTablet ? 100 : 80,
    textAlignVertical: 'top',
  },
});
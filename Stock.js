import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("data1.db");

export default function StockScreen() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists items (id integer primary key autoincrement, name text, product_name text, quantity int, price real)"
      );
    });
    fetchItems();
  }, []);

  const fetchItems = () => {
    db.transaction((tx) => {
      tx.executeSql("select * from items", [], (_, { rows }) => {
        setItems(rows["_array"]);
      });
    });
  };

  const addItem = () => {
    if (!productName) {
      Alert.alert("แจ้งเตือน!", "กรุณากรอกชื่อสินค้า");
    } else if (!price) {
      Alert.alert("แจ้งเตือน!", "กรุณากรอกราคา");
    } else if (!quantity) {
      Alert.alert("แจ้งเตือน!", "กรุณากรอกสต๊อกสินค้า");
    } else if (!name) {
      Alert.alert("แจ้งเตือน!", "กรุณากรอกหน่วยนับ");
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          "insert into items (name, product_name, quantity, price) values (?, ?, ?, ?)",
          [name, productName, quantity, price],
          () => {
            fetchItems();
            setName("");
            setProductName("");
            setQuantity("");
            setPrice("");
          }
        );
      });
    }
  };

  const updateItem = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "update items set name = ?, product_name = ?, quantity = ?,price = ? where id = ?",
        [name, productName, quantity, price, editingItem.id],
        () => {
          fetchItems();
          setName("");
          setProductName("");
          setPrice("");
          setQuantity("");
          setEditingItem(null);
        }
      );
    });
  };

  const deleteItem = (id) => {
    db.transaction((tx) => {
      tx.executeSql("delete from items where id = ?", [id], () => {
        fetchItems();
      });
    });
  };

  const editItem = (item) => {
    setName(item.name);
    setProductName(item.product_name);
    setPrice(item.price.toString());
    setQuantity(item.quantity.toString());
    setEditingItem(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>เพิ่มข้อมูลสินค้า</Text>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "68%" }}>
          <TextInput
            style={styles.input}
            placeholder="ชื่อสินค้า"
            value={productName}
            onChangeText={(text) => setProductName(text)}
          />
        </View>
        <View style={{ padding: 3 }} />
        <View style={{ width: "30%" }}>
          <TextInput
            style={styles.input}
            placeholder="กรอกราคา"
            keyboardType="numeric"
            value={price}
            onChangeText={(text) => setPrice(text)}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={{ width: "49%" }}>
          <TextInput
            style={styles.input}
            placeholder="จำนวนสต๊อก"
            keyboardType="numeric"
            value={quantity}
            onChangeText={(text) => setQuantity(text)}
          />
        </View>
        <View style={{ padding: 3 }} />
        <View style={{ width: "49%" }}>
          <TextInput
            style={styles.input}
            placeholder="หน่วยนับ"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
      </View>
      <Button
        title={editingItem ? "แก้ไข" : "เพิ่มข้อมูล"}
        onPress={editingItem ? updateItem : addItem}
      />
      <View style={{ padding: 5 }} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.itemText}>
                ชื่อสินค้า: {item.product_name}
              </Text>
              <Text style={styles.itemText}>ราคา: {item.price} ฿</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.itemText}>สต๊อก: {item.quantity}</Text>
              <Text style={styles.itemText}>หน่วยนับ: {item.name}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%" }}>
                <Button
                  title="แก้ไข"
                  color={"green"}
                  onPress={() => editItem(item)}
                />
              </View>
              <View style={{ padding: 5 }} />
              <View style={{ width: "50%" }}>
                <Button
                  title="ลบ"
                  color={"red"}
                  onPress={() => deleteItem(item.id)}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    padding: 8,
  },
  itemContainer: {
    //borderWidth:1,
    borderRadius: 5,
    paddingHorizontal: 20,
    backgroundColor: "#eee",
    // borderBottomWidth: 1,
    borderColor: "gray",
    marginBottom: 8,
    paddingBottom: 8,
    paddingTop: 5,
  },
  itemText: {
    fontSize: 16,
  },
});

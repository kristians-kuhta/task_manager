import Map "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  type Task = {
    title: Text;
    createdAt: Time.Time;
    editedAt: Time.Time;
  };

  func natHash(number: Nat) : Hash.Hash {
    Text.hash(Nat.toText(number));
  };

  let tasks = Map.HashMap<Nat, Task>(0, Nat.equal, natHash);

  public func addTask(title : Text): async Nat {
    let taskId : Nat = tasks.size();

    tasks.put(taskId, { title = title; createdAt = Time.now(); editedAt = Time.now(); });
    taskId
  };

  public func getTask(taskId: Nat): async ?Task {
    tasks.get(taskId);
  };

  public query func getTasks() : async [(Nat, Task)] {
    Iter.toArray(tasks.entries());
  };

  public func editTask(taskId: Nat, title: Text): async Bool {
    ignore do ? {
      // NOTE: because ! is being used it will break out of the DO block if createdAt is null
      let createdAt : Time.Time = tasks.get(taskId)!.createdAt;

      tasks.delete(taskId);
      tasks.put(taskId, { title = title; editedAt = Time.now(); createdAt = createdAt; });
      return true;
    };

    false;
  };

  public func removeTask(taskId: Nat): async () {
    tasks.delete(taskId);
  };
};

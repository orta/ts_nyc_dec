const track = (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
  console.log("Analytics event")
  return descriptor
}  

class MyApp {
  @track
  method() { return "hello world" }
}

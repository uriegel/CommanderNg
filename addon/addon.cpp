#include <nan.h>
#include <string>
#include "Worker.h"
#include "utils.h"
using namespace std;
using namespace Nan;
using namespace v8;

NAN_METHOD(GetTest) {
	Utf8String val(To<String>(info[0]).ToLocalChecked());
	auto input = Utf8Decode(*val);

    info.GetReturnValue().Set(New<String>("das Ergebnis").ToLocalChecked());
}

NAN_METHOD(GetTestAsync) {
	Utf8String val(To<String>(info[0]).ToLocalChecked());
	auto input = Utf8Decode(*val);

    auto callback = new Callback(info[1].As<Function>());
    AsyncQueueWorker(new Worker(callback, 
		[]()-> void { Sleep(); }, 
		[](Nan::Callback* callback)-> void {
			Local<Value> argv[] = { Nan::Null(), New<String>("das Ergebnis mit Verzögerung").ToLocalChecked() };
			Call(*callback, 2, argv).ToLocalChecked();
		}
	));    
}

NAN_MODULE_INIT(init) {
	Nan::Set(target, New<String>("getTest").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetTest)).ToLocalChecked());
    Nan::Set(target, New<String>("getTestAsync").ToLocalChecked(), GetFunction(New<FunctionTemplate>(GetTestAsync)).ToLocalChecked());
}

NODE_MODULE(addon, init)